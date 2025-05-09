# Decentralized Education Platform with MetaMask & Gaia

## 🌟 Overview

The Decentralized Education Platform is a comprehensive learning system built on Web3 technologies that seamlessly integrates Gaia's advanced AI capabilities with MetaMask's Delegation Toolkit (DTK). This platform enables users to access educational content about blockchain, Web3, and cryptocurrency while leveraging the security and ownership benefits of decentralized technologies.

![Gaia Delegation Toolkit Gif](./gaia-dtk-2.gif)

The starter includes a full ERC20 token creation system through an integrated factory contract, allowing users to deploy custom tokens directly through the application. Combined with AI-powered interactions, this creates a powerful platform for building next-generation decentralized applications.

## ✨ Features

- **Educational Content**: Access structured courses on blockchain, Web3, and cryptocurrency topics
- **AI-Powered Learning**: Utilize Gaia's AI to get personalized explanations and assistance
- **Interactive Course Modules**: Engage with educational content through an intuitive interface
- **Progress Tracking**: Track your learning progress across different courses and modules
- **Certificate Generation**: Earn and download certificates upon course completion
- **Learning Dashboard**: View your enrolled courses, progress, and earned certificates
- **ERC20 Token Creation**: Create custom ERC20 tokens through the integrated factory contract
- **Secure Blockchain Integration**: Connect with the Ethereum ecosystem through MetaMask's trusted wallet infrastructure
- **Delegation Management**: MetaMask's Delegation Toolkit for managing user-to-AI agent delegations
- **Robust Error Handling**: Comprehensive error handling system for improved reliability
- **Modern UI Components**: Sleek, responsive interface with dark mode support
- **Next.js App Router**: Built on Next.js with the modern App Router architecture
- **TypeScript Support**: Full TypeScript integration for type safety and better developer experience

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- pnpm package manager
- MetaMask extension installed in your browser

### Installation

1. Clone the repository:

```bash
git clone https://github.com/meowyx/metamask-gaia-starter.git
```

2. Navigate to the project directory:

```bash
cd metamask-gaia-starter
```

3. Install dependencies using pnpm:

```bash
pnpm install
```

4. Create a `.env` file in the root directory with the following configuration:

```
# Factory contract configuration
NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CREATE_TOKEN_SELECTOR=0x...

# Bundler service configuration
NEXT_PUBLIC_BUNDLER_URL=https://api.pimlico.io/v2/137/rpc?apikey=YOUR_API_KEY
NEXT_PUBLIC_CHAIN_ID=59141

# Infura and private key configuration
INFURA_PROJECT_ID=your_infura_project_id
PRIVATE_KEY=your_private_key

# Delegation storage configuration
NEXT_PUBLIC_DELEGATION_STORAGE_API_KEY=your_delegation_api_key
NEXT_PUBLIC_DELEGATION_STORAGE_API_KEY_ID=your_delegation_api_key_id
NEXT_PUBLIC_DELEGATION_STORAGE_ENVIRONMENT=development

# Gaia AI configuration
GAIA_MODEL_BASE_URL=your_gaia_model_url
GAIA_API_KEY=your_gaia_api_key
```

5. Start the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application running.

## 📖 Project Structure

```
├── .next/             # Next.js build output
├── ai/                # AI-related utilities
│   └── tools.ts       # AI tools implementation
├── app/               # Next.js App Router 
│   ├── api/           # API routes
│   │   └── gaia/      # Gaia API proxy routes
│   ├── chat/          # AI chat interface
│   │   └── page.tsx   # Chat page component
│   ├── dashboard/     # User dashboard
│   │   └── page.tsx   # Dashboard page component
│   ├── education/     # Education platform
│   │   └── page.tsx   # Education page component
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout component
│   └── page.tsx       # Home page component
├── components/        # Reusable UI components
│   ├── Certificate.tsx # Certificate component
│   ├── EducationHub.tsx # Education hub component
│   ├── Navigation.tsx  # Navigation component
│   ├── ui/            # Basic UI components
│   │   ├── badge.tsx  # Badge component
│   │   ├── button.tsx # Button component
│   │   ├── card.tsx   # Card component
│   │   ├── input.tsx  # Input component
│   │   └── tabs.tsx   # Tabs component
│   ├── Chat.tsx       # Chat interface component
│   ├── DelegationManager.tsx # Delegation management component
│   ├── EducationHub.tsx # Education platform component
│   ├── Message.tsx    # Message component
│   └── Navigation.tsx # Navigation component
├── lib/               # Utility functions and libraries
│   └── services/      # API services
│       ├── bundler.ts # Bundler service implementation
│       ├── errorHandler.ts # Error handling service
│       └── gaia.ts    # Gaia API integration service
├── public/            # Static assets
│   ├── file.svg       # File icon
│   ├── globe.svg      # Globe icon
│   ├── next.svg       # Next.js logo
│   └── vercel.svg     # Vercel logo
├── node_modules/      # Dependencies
├── .env               # Environment variables
├── package.json       # Project dependencies
└── pnpm-lock.yaml    # pnpm lock file
```

## 🔧 Configuration

## 🔧 Configuration

### ERC20 Factory Contract Setup

This project integrates with the [ERC20 Factory Contract](https://github.com/meowyx/erc20-factory) to enable token creation capabilities. Follow these steps to set up the integration:

1. Clone and deploy the ERC20 Factory contract:
   ```bash
   git clone https://github.com/meowyx/erc20-factory
   cd erc20-factory
   npm install
   npx hardhat compile
   npx hardhat ignition deploy ignition/modules/tokenFactory.ts --network linea-testnet
   ```

2. After deployment, update your `.env` file with the deployed contract address:
   ```
   NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS=0x...  # The deployed factory contract address
   NEXT_PUBLIC_CREATE_TOKEN_SELECTOR=0x...     # The function selector for createToken
   ```

3. Update the `constants.ts` file with the ERC20 Factory ABI:
   ```typescript
   // Add the ERC20 Factory ABI to your constants.ts file
   export const FACTORY_ABI = [
     // ... ABI contents from the compiled contract
     {
       "inputs": [
         {"internalType": "string", "name": "name", "type": "string"},
         {"internalType": "string", "name": "symbol", "type": "string"},
         {"internalType": "uint8", "name": "decimals", "type": "uint8"},
         {"internalType": "uint256", "name": "initialSupply", "type": "uint256"}
       ],
       "name": "createToken",
       "outputs": [{"internalType": "address", "name": "", "type": "address"}],
       "stateMutability": "nonpayable",
       "type": "function"
     }
     // ... other ABI entries
   ];
   ```

4. The factory contract allows you to create new ERC20 tokens with custom parameters such as name, symbol, decimals, and initial supply.

The ERC20 Factory project structure:
```
erc20-factory/
├── contracts/
│   ├── BaseERC20Token.sol   # Base token implementation
│   └── ERC20Factory.sol     # Factory for deploying tokens
├── test/
│   └── ERC20Factory.test.js # Test scripts
├── ignition/
│   └── modules/
│       └── tokenFactory.js  # Deployment configuration
├── hardhat.config.js        # Hardhat configuration
└── package.json             # Project dependencies
```

### MetaMask Setup

1. Install the [MetaMask extension](https://metamask.io/) in your browser
2. Create or import a wallet
3. Connect your dApp using the provided hooks in the starter

### Gaia Integration

1. Sign up for an API key over at [Gaia](https://gaianet.ai)
2. Add your API key to the `.env` file under `GAIA_API_KEY`
3. Set the model base URL in the `.env` file under `GAIA_MODEL_BASE_URL`
4. Use the pre-configured AI tools in `ai/tools.ts` to interact with Gaia features

#### Gaia in the Education Platform

The decentralized education platform leverages Gaia's AI capabilities in several key ways:

1. **AI-Powered Learning Assistant**: The platform includes a dedicated chat interface where students can ask questions about blockchain, Web3, and cryptocurrency concepts. The AI assistant provides educational responses tailored to the user's level of understanding.

2. **Course Content Enhancement**: Within each course module, students can ask specific questions about the content they're learning. The AI provides additional explanations, examples, and clarifications to enhance the learning experience.

3. **Personalized Learning**: The AI adapts to each student's learning style and pace, providing customized explanations and recommendations for further study.

4. **Knowledge Verification**: Students can test their understanding by asking the AI assistant to quiz them on concepts they've learned, providing immediate feedback and correction.

The Gaia integration is implemented through the `lib/services/gaia.ts` service, which provides a clean API for interacting with Gaia's AI capabilities throughout the application.

### Bundler Service Configuration

1. Get an API key from [Pimlico](https://pimlico.io/) or your preferred bundler service
2. Add the bundler URL to the `.env` file under `NEXT_PUBLIC_BUNDLER_URL`
3. Set the correct chain ID in the `.env` file under `NEXT_PUBLIC_CHAIN_ID`

### Delegation System Setup

1. Configure the delegation storage API keys in the `.env` file
2. Use the `DelegationManager.tsx` component to manage delegations between users and AI agents

## 📚 Documentation

For more detailed information about the technologies used in this starter:

- [Next.js Documentation](https://nextjs.org/docs)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Gaia Documentation](https://docs.gaianet.ai/)
- [pnpm Documentation](https://pnpm.io/documentation)


## 👥 Contributing

Contributions are always welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

Please ensure your code follows the project's coding standards and includes appropriate tests.


## 🙏 Acknowledgements

- [MetaMask Delegation Toolkit](https://docs.gator.metamask.io/) for their Delegation Toolkit.
- [Gaia](https://gaianet.ai/) for their AI platform
- [Next.js](https://nextjs.org/) for the React framework
- [Vercel AI SDK](https://sdk.vercel.ai/) for The AI Toolkit for TypeScript
