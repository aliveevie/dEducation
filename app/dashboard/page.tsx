"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Certificate } from "@/components/Certificate";
import { useAccount } from "wagmi";
import Link from "next/link";
import { BookOpen, GraduationCap, Award, Brain, ArrowRight, BarChart3, Clock, Trophy } from "lucide-react";

interface CourseProgress {
  id: string;
  title: string;
  completedModules: number;
  totalModules: number;
  lastAccessed: Date;
  category: string;
}

interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  issueDate: Date;
  recipient: string;
}

interface Course {
  id: string;
  title: string;
}

interface UserProgress {
  enrolledCourses: Course[];
  certificates: Certificate[];
}

export default function DashboardPage() {
  const { isConnected, address } = useAccount();
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user's course progress and certificates from localStorage
  useEffect(() => {
    if (isConnected && address) {
      setLoading(true);
      
      // Load course progress
      try {
        const storedEnrollments = localStorage.getItem(`enrollments_${address}`);
        if (storedEnrollments) {
          const enrollmentIds = JSON.parse(storedEnrollments) as string[];
          const progress: CourseProgress[] = [];
          
          enrollmentIds.forEach(courseId => {
            const courseProgressStr = localStorage.getItem(`course_progress_${address}_${courseId}`);
            if (courseProgressStr) {
              const courseModules = JSON.parse(courseProgressStr);
              const completedModules = courseModules.filter((m: any) => m.completed).length;
              
              // Get course details (in a real app, this would come from a database)
              const courseDetails = {
                id: courseId,
                title: courseId === "web3-fundamentals" 
                  ? "Web3 Fundamentals" 
                  : courseId === "defi-masterclass" 
                    ? "DeFi Masterclass" 
                    : courseId === "smart-contract-dev" 
                      ? "Smart Contract Development" 
                      : courseId,
                totalModules: courseModules.length,
                category: courseId === "web3-fundamentals" 
                  ? "blockchain" 
                  : courseId === "defi-masterclass" 
                    ? "finance" 
                    : "development",
                lastAccessed: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) // Random date within last week
              };
              
              progress.push({
                ...courseDetails,
                completedModules
              });
            }
          });
          
          setCourseProgress(progress);
        }
        
        // Load certificates
        const storedCertificates = localStorage.getItem(`certificates_${address}`);
        if (storedCertificates) {
          const certs = JSON.parse(storedCertificates);
          // Convert string dates back to Date objects
          const certsWithDates = certs.map((cert: any) => ({
            ...cert,
            issueDate: new Date(cert.issueDate)
          }));
          setCertificates(certsWithDates);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [isConnected, address]);

  // Generate a new certificate for a completed course
  const generateCertificate = (course: CourseProgress) => {
    if (course.completedModules < course.totalModules) {
      alert("You need to complete all modules to receive a certificate");
      return;
    }
    
    // Check if certificate already exists
    if (certificates.some(cert => cert.courseId === course.id)) {
      alert("You already have a certificate for this course");
      return;
    }
    
    // Create new certificate
    const newCertificate: Certificate = {
      id: `cert-${Date.now()}`,
      courseId: course.id,
      courseTitle: course.title,
      issueDate: new Date(),
      recipient: address || "Unknown"
    };
    
    // Add to certificates list
    const updatedCertificates = [...certificates, newCertificate];
    setCertificates(updatedCertificates);
    
    // Save to localStorage
    localStorage.setItem(`certificates_${address}`, JSON.stringify(updatedCertificates));
    
    alert(`Certificate for ${course.title} has been generated!`);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate overall progress percentage
  const calculateOverallProgress = () => {
    if (courseProgress.length === 0) return 0;
    
    const totalCompleted = courseProgress.reduce((sum, course) => sum + course.completedModules, 0);
    const totalModules = courseProgress.reduce((sum, course) => sum + course.totalModules, 0);
    
    return Math.round((totalCompleted / totalModules) * 100);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-1 container max-w-6xl mx-auto py-8 px-4">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
            <GraduationCap className="h-16 w-16 text-gray-400" />
            <h2 className="text-2xl font-semibold">Connect Your Wallet</h2>
            <p className="text-gray-600 max-w-md">
              Please connect your wallet to view your learning dashboard.
            </p>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-8">Learning Dashboard</h1>
            
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                    Enrolled Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{courseProgress.length}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
                    Overall Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{calculateOverallProgress()}%</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${calculateOverallProgress()}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Award className="h-5 w-5 mr-2 text-purple-500" />
                    Certificates Earned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{certificates.length}</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Course Progress Section */}
            <h2 className="text-2xl font-semibold mb-4">Your Learning Progress</h2>
            {courseProgress.length === 0 ? (
              <Card className="mb-8">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-center text-gray-500">
                    You haven't enrolled in any courses yet.
                  </p>
                  <Link href="/education">
                    <Button className="mt-4">
                      Browse Courses
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 mb-8">
                {courseProgress.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="p-6 md:col-span-2">
                          <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                          <div className="flex items-center mb-3">
                            <Badge variant="outline" className="mr-2">
                              {course.category}
                            </Badge>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Last accessed: {formatDate(course.lastAccessed)}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className="font-medium">Progress:</span>{" "}
                              {course.completedModules} / {course.totalModules} modules
                            </p>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ 
                                  width: `${(course.completedModules / course.totalModules) * 100}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6 md:col-span-3 flex items-center justify-between border-t md:border-t-0 md:border-l">
                          <div>
                            <p className="text-sm text-gray-500 mb-2">
                              {course.completedModules === course.totalModules ? (
                                <span className="text-green-600 dark:text-green-400 font-medium flex items-center">
                                  <Trophy className="h-4 w-4 mr-1" />
                                  Course Completed
                                </span>
                              ) : (
                                `${Math.round((course.completedModules / course.totalModules) * 100)}% Complete`
                              )}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Link href={`/education?course=${course.id}`}>
                                <Button variant="outline" size="sm">
                                  Continue Learning
                                </Button>
                              </Link>
                              
                              {course.completedModules === course.totalModules && (
                                <Button 
                                  size="sm"
                                  onClick={() => generateCertificate(course)}
                                  disabled={certificates.some(cert => cert.courseId === course.id)}
                                >
                                  {certificates.some(cert => cert.courseId === course.id) ? 
                                    "Certificate Issued" : 
                                    "Get Certificate"}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Certificates Section */}
            <h2 className="text-2xl font-semibold mb-4">Your Certificates</h2>
            {certificates.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Award className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-center text-gray-500">
                    You haven't earned any certificates yet.
                  </p>
                  <p className="text-center text-gray-500 text-sm mt-2">
                    Complete a course to earn your first certificate.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((certificate) => (
                  <Card key={certificate.id} className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                      <Award className="w-full h-full text-blue-500" />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="h-5 w-5 mr-2 text-blue-500" />
                        Certificate of Completion
                      </CardTitle>
                      <CardDescription>
                        Issued on {formatDate(certificate.issueDate)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Course</p>
                          <p className="text-lg font-semibold">{certificate.courseTitle}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Recipient</p>
                          <p className="text-sm font-mono">{certificate.recipient}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Certificate ID</p>
                          <p className="text-sm font-mono">{certificate.id}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setSelectedCertificate(certificate)}
                      >
                        View Certificate
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Certificate Modal */}
            {selectedCertificate && (
              <Certificate
                id={selectedCertificate.id}
                courseTitle={selectedCertificate.courseTitle}
                recipient={selectedCertificate.recipient}
                issueDate={selectedCertificate.issueDate}
                onClose={() => setSelectedCertificate(null)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
