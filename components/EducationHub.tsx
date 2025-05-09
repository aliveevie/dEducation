"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { gaiaService } from "@/lib/services/gaia";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, GraduationCap, Award, Brain } from "lucide-react";

// Define course interface
interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  modules: Module[];
  author: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  enrolled?: boolean;
}

// Define module interface
interface Module {
  id: string;
  title: string;
  content: string;
  completed?: boolean;
}

// Sample courses data
const sampleCourses: Course[] = [
  {
    id: "web3-fundamentals",
    title: "Web3 Fundamentals",
    description: "Learn the core concepts of Web3, blockchain technology, and decentralized applications.",
    category: "blockchain",
    author: "Blockchain Expert",
    difficulty: "beginner",
    modules: [
      {
        id: "web3-intro",
        title: "Introduction to Web3",
        content: "Web3 represents the next evolution of the internet, built on decentralized protocols..."
      },
      {
        id: "blockchain-basics",
        title: "Blockchain Basics",
        content: "A blockchain is a distributed ledger that records transactions across many computers..."
      }
    ]
  },
  {
    id: "defi-masterclass",
    title: "DeFi Masterclass",
    description: "Master decentralized finance concepts, protocols, and investment strategies.",
    category: "finance",
    author: "DeFi Specialist",
    difficulty: "intermediate",
    modules: [
      {
        id: "defi-intro",
        title: "What is DeFi?",
        content: "Decentralized Finance (DeFi) refers to financial applications built on blockchain technology..."
      },
      {
        id: "defi-protocols",
        title: "Major DeFi Protocols",
        content: "In this module, we'll explore the leading DeFi protocols including Uniswap, Aave, and Compound..."
      }
    ]
  },
  {
    id: "smart-contract-dev",
    title: "Smart Contract Development",
    description: "Learn to write, test, and deploy secure smart contracts on Ethereum.",
    category: "development",
    author: "Smart Contract Developer",
    difficulty: "advanced",
    modules: [
      {
        id: "solidity-basics",
        title: "Solidity Fundamentals",
        content: "Solidity is an object-oriented programming language for writing smart contracts..."
      },
      {
        id: "security-best-practices",
        title: "Security Best Practices",
        content: "Smart contract security is critical. In this module, we'll cover common vulnerabilities..."
      }
    ]
  }
];

export const EducationHub = () => {
  const { address, isConnected } = useAccount();
  const [courses, setCourses] = useState<Course[]>(sampleCourses);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [question, setQuestion] = useState("");

  // Load user's enrolled courses from localStorage on component mount
  useEffect(() => {
    if (isConnected && address) {
      const storedEnrollments = localStorage.getItem(`enrollments_${address}`);
      if (storedEnrollments) {
        const enrollmentIds = JSON.parse(storedEnrollments) as string[];
        
        // Mark courses as enrolled
        const updatedCourses = courses.map(course => ({
          ...course,
          enrolled: enrollmentIds.includes(course.id)
        }));
        setCourses(updatedCourses);
        
        // Filter enrolled courses
        const userEnrolledCourses = updatedCourses.filter(course => 
          enrollmentIds.includes(course.id)
        );
        setEnrolledCourses(userEnrolledCourses);
      }
    }
  }, [isConnected, address]);

  // Filter courses based on search query
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Enroll in a course
  const enrollInCourse = (courseId: string) => {
    if (!isConnected) {
      alert("Please connect your wallet to enroll in courses");
      return;
    }

    setLoading(true);
    
    // Find the course
    const courseToEnroll = courses.find(c => c.id === courseId);
    if (!courseToEnroll) {
      setLoading(false);
      return;
    }

    // Update courses state
    const updatedCourses = courses.map(course => 
      course.id === courseId ? { ...course, enrolled: true } : course
    );
    setCourses(updatedCourses);

    // Update enrolled courses
    const updatedEnrolledCourses = [...enrolledCourses, courseToEnroll];
    setEnrolledCourses(updatedEnrolledCourses);

    // Save to localStorage
    const enrollmentIds = updatedEnrolledCourses.map(c => c.id);
    localStorage.setItem(`enrollments_${address}`, JSON.stringify(enrollmentIds));

    setLoading(false);
  };

  // View course details
  const viewCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setSelectedModule(course.modules[0] || null);
    }
  };

  // Ask AI assistant about the course content
  const askAI = async () => {
    if (!question.trim() || !selectedCourse || !selectedModule) return;

    setAiLoading(true);
    setAiResponse("");

    try {
      // Create context from the current course and module
      const context = `
Course: ${selectedCourse.title}
Module: ${selectedModule.title}
Content: ${selectedModule.content}
      `;

      const response = await gaiaService.createChatCompletion({
        messages: [
          { 
            role: "system", 
            content: "You are an educational AI assistant for a decentralized education platform. Your goal is to help users understand blockchain, Web3, and related concepts. Be concise, accurate, and helpful. When explaining complex topics, use simple analogies where appropriate." 
          },
          { 
            role: "user", 
            content: `Context: ${context}\n\nQuestion: ${question}` 
          }
        ],
        temperature: 0.7
      });

      setAiResponse(response.choices[0].message.content);
    } catch (error) {
      console.error("Error querying Gaia AI:", error);
      setAiResponse("Sorry, I encountered an error while processing your question. Please try again later.");
    } finally {
      setAiLoading(false);
    }
  };

  // Mark a module as completed
  const markModuleCompleted = (courseId: string, moduleId: string) => {
    if (!isConnected) return;

    // Update courses
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        const updatedModules = course.modules.map(module => 
          module.id === moduleId ? { ...module, completed: true } : module
        );
        return { ...course, modules: updatedModules };
      }
      return course;
    });
    setCourses(updatedCourses);

    // Update enrolled courses
    const updatedEnrolledCourses = updatedCourses.filter(course => 
      enrolledCourses.some(ec => ec.id === course.id)
    );
    setEnrolledCourses(updatedEnrolledCourses);

    // Save progress to localStorage
    localStorage.setItem(`course_progress_${address}_${courseId}`, JSON.stringify(
      updatedCourses.find(c => c.id === courseId)?.modules.map(m => ({ id: m.id, completed: m.completed }))
    ));
  };

  // Render difficulty badge
  const renderDifficultyBadge = (difficulty: "beginner" | "intermediate" | "advanced") => {
    const colors = {
      beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    };

    return (
      <Badge className={`${colors[difficulty]} font-medium`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs defaultValue="explore" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="explore" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Explore Courses
          </TabsTrigger>
          <TabsTrigger value="enrolled" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            My Learning
          </TabsTrigger>
        </TabsList>
        
        {/* Explore Courses Tab */}
        <TabsContent value="explore" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Explore Courses</h2>
            <div className="w-1/3">
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    {renderDifficultyBadge(course.difficulty)}
                  </div>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Author:</span> {course.author}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Modules:</span> {course.modules.length}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {course.category}
                  </Badge>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => viewCourse(course.id)}
                  >
                    View Details
                  </Button>
                  {course.enrolled ? (
                    <Button variant="secondary" disabled>
                      Enrolled
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => enrollInCourse(course.id)}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enrolling...
                        </>
                      ) : (
                        "Enroll Now"
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* My Learning Tab */}
        <TabsContent value="enrolled" className="space-y-4">
          <h2 className="text-2xl font-bold">My Learning</h2>
          
          {enrolledCourses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <GraduationCap className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-center text-gray-500 dark:text-gray-400">
                  You haven't enrolled in any courses yet.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => document.querySelector('[data-value="explore"]')?.dispatchEvent(new Event('click'))}
                >
                  Explore Courses
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrolledCourses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Progress:</span>{" "}
                        {course.modules.filter(m => m.completed).length} / {course.modules.length} modules
                      </p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ 
                            width: `${(course.modules.filter(m => m.completed).length / course.modules.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => viewCourse(course.id)}>
                      Continue Learning
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Course Detail View */}
      {selectedCourse && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedCourse(null);
                setSelectedModule(null);
              }}
            >
              Back to Courses
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Module Navigation */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Modules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedCourse.modules.map((module, index) => (
                      <div 
                        key={module.id}
                        className={`p-3 rounded-md cursor-pointer flex items-center justify-between ${
                          selectedModule?.id === module.id 
                            ? 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setSelectedModule(module)}
                      >
                        <div className="flex items-center">
                          <span className="font-medium mr-2">{index + 1}.</span>
                          <span>{module.title}</span>
                        </div>
                        {module.completed && (
                          <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Completed
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Module Content */}
            <div className="md:col-span-2">
              {selectedModule && (
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{selectedModule.title}</CardTitle>
                    <CardDescription>
                      Module {selectedCourse.modules.findIndex(m => m.id === selectedModule.id) + 1} of {selectedCourse.modules.length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: selectedModule.content.replace(/\n/g, '<br />') }} />
                  </CardContent>
                  <CardFooter className="flex flex-col items-start space-y-4 w-full">
                    {selectedCourse.enrolled && (
                      <Button 
                        className="w-full"
                        disabled={selectedModule.completed}
                        onClick={() => markModuleCompleted(selectedCourse.id, selectedModule.id)}
                      >
                        {selectedModule.completed ? "Completed" : "Mark as Completed"}
                      </Button>
                    )}
                    
                    {/* AI Assistant */}
                    <Card className="w-full mt-4 border-dashed">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md flex items-center">
                          <Brain className="h-5 w-5 mr-2" />
                          Ask AI Assistant
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Ask a question about this module..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            onClick={askAI}
                            disabled={aiLoading || !question.trim()}
                          >
                            {aiLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Ask"
                            )}
                          </Button>
                        </div>
                        
                        {aiResponse && (
                          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                            <p className="text-sm font-medium mb-2">AI Response:</p>
                            <div className="text-sm">{aiResponse}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
