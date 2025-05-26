"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExperienceById = exports.getExperiencesByTags = exports.experiences = void 0;
exports.experiences = [
    {
        id: "aws-elemental",
        company: "AWS Elemental",
        position: "Software Engineer, AWS MediaConvert",
        location: "Portland, OR",
        startDate: "January 2018",
        endDate: "June 2019",
        description: [
            "Optimized video transcoding engine for improved performance",
            "Rewrote Quicktime decoder enhancing metadata parsing accuracy",
            "Developed automated testing framework for validation components",
            "Resolved customer issues through direct support and code changes",
            "Promoted to SDE II and moved teams to Address Intelligence"
        ],
        techStack: [
            {
                category: "Languages",
                technologies: [
                    { name: "C++", url: "https://isocpp.org/" },
                    { name: "Python", url: "https://www.python.org/" },
                    { name: "Ruby", url: "https://www.ruby-lang.org/" }
                ]
            },
            {
                category: "Cloud",
                technologies: [
                    { name: "AWS", url: "https://aws.amazon.com/" },
                    { name: "EC2", url: "https://aws.amazon.com/ec2/" },
                    { name: "S3", url: "https://aws.amazon.com/s3/" },
                    { name: "CloudFront", url: "https://aws.amazon.com/cloudfront/" }
                ]
            },
            {
                category: "Media",
                technologies: [
                    { name: "FFmpeg", url: "https://ffmpeg.org/" },
                    { name: "H.264/H.265", url: "https://en.wikipedia.org/wiki/Advanced_Video_Coding" },
                    { name: "VP9", url: "https://en.wikipedia.org/wiki/VP9" },
                    { name: "AV1", url: "https://en.wikipedia.org/wiki/AV1" }
                ]
            },
            {
                category: "Infrastructure",
                technologies: [
                    { name: "Docker", url: "https://www.docker.com/" },
                    { name: "Jenkins", url: "https://www.jenkins.io/" },
                    { name: "Terraform", url: "https://www.terraform.io/" }
                ]
            },
            {
                category: "Performance",
                technologies: [
                    { name: "SIMD", url: "https://en.wikipedia.org/wiki/SIMD" },
                    { name: "Threading", url: "https://en.wikipedia.org/wiki/Thread_(computing)" },
                    { name: "GPU Acceleration", url: "https://en.wikipedia.org/wiki/Graphics_processing_unit" }
                ]
            },
            {
                category: "Testing",
                technologies: [
                    { name: "GTest", url: "https://github.com/google/googletest" },
                    { name: "Pytest", url: "https://docs.pytest.org/" },
                    { name: "Selenium", url: "https://www.selenium.dev/" }
                ]
            }
        ],
        tags: ["backend", "cloud", "media", "performance", "enterprise", "aws"]
    },
    {
        id: "amazon-address-intelligence",
        company: "Amazon, Inc.",
        position: "Software Engineer, Address Intelligence",
        location: "Portland, OR",
        startDate: "June 2019",
        endDate: "December 2021",
        description: [
            "Promoted to SDE II within 18 months",
            "Architected address management system for delivery route optimization",
            "Improved cross-region performance through stack regionalization",
            "Built self-service permission system automating internal workflows",
            "Maintained high service reliability across multiple regions",
            "Led migration from monolith to microservices architecture"
        ],
        techStack: [
            {
                category: "Frontend",
                technologies: [
                    { name: "React Native", url: "https://reactnative.dev/" },
                    { name: "TypeScript", url: "https://www.typescriptlang.org/" },
                    { name: "Redux", url: "https://redux.js.org/" },
                    { name: "Jest", url: "https://jestjs.io/" }
                ]
            },
            {
                category: "Cloud",
                technologies: [
                    { name: "AWS", url: "https://aws.amazon.com/" },
                    { name: "Lambda", url: "https://aws.amazon.com/lambda/" },
                    { name: "DynamoDB", url: "https://aws.amazon.com/dynamodb/" },
                    { name: "S3", url: "https://aws.amazon.com/s3/" },
                    { name: "CloudFormation", url: "https://aws.amazon.com/cloudformation/" }
                ]
            },
            {
                category: "Backend",
                technologies: [
                    { name: "Java", url: "https://www.java.com/" },
                    { name: "Python", url: "https://www.python.org/" },
                    { name: "Node.js", url: "https://nodejs.org/" },
                    { name: "Redis", url: "https://redis.io/" }
                ]
            },
            {
                category: "Database",
                technologies: [
                    { name: "DynamoDB", url: "https://aws.amazon.com/dynamodb/" },
                    { name: "Aurora PostgreSQL", url: "https://aws.amazon.com/rds/aurora/" }
                ]
            },
            {
                category: "DevOps",
                technologies: [
                    { name: "CI/CD", url: "https://about.gitlab.com/topics/ci-cd/" },
                    { name: "Docker", url: "https://www.docker.com/" },
                    { name: "Terraform", url: "https://www.terraform.io/" },
                    { name: "CloudWatch", url: "https://aws.amazon.com/cloudwatch/" }
                ]
            },
            {
                category: "Architecture",
                technologies: [
                    { name: "Microservices", url: "https://aws.amazon.com/microservices/" },
                    { name: "Event-driven", url: "https://aws.amazon.com/event-driven-architecture/" },
                    { name: "Serverless", url: "https://aws.amazon.com/serverless/" }
                ]
            }
        ],
        tags: ["fullstack", "mobile", "cloud", "microservices", "enterprise", "aws", "promotion"]
    },
    {
        id: "stems-labs",
        company: "Stems Labs",
        position: "Senior Software Engineer",
        location: "Remote",
        startDate: "November 2022",
        endDate: "February 2024",
        description: [
            "Led creation and development of Stem Studio, a mobile audio remixing platform",
            "Architected full-stack system for professional audio processing with intelligent agents for effects recommendation",
            "Integrated Python audio models and CoreML for on-device audio processing",
            "Optimized processing costs through AI-powered effects generation",
            "Built integration layer supporting major streaming platforms (Spotify, Apple Music)"
        ],
        techStack: [
            {
                category: "Mobile",
                technologies: [
                    { name: "Swift", url: "https://www.swift.org/" },
                    { name: "AVFoundation", url: "https://developer.apple.com/av-foundation/" },
                    { name: "CoreAudio", url: "https://developer.apple.com/documentation/coreaudio" },
                    { name: "AudioKit", url: "https://audiokit.io/" },
                    { name: "MIDI", url: "https://developer.apple.com/documentation/coremidi" }
                ]
            },
            {
                category: "Frontend",
                technologies: [
                    { name: "React", url: "https://react.dev/" },
                    { name: "WebGL", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API" }
                ]
            },
            {
                category: "Backend",
                technologies: [
                    { name: "Python", url: "https://www.python.org/" },
                    { name: "Golang", url: "https://go.dev/" },
                    { name: "FastAPI", url: "https://fastapi.tiangolo.com/" },
                    { name: "GraphQL", url: "https://graphql.org/" },
                    { name: "Redis", url: "https://redis.io/" }
                ]
            },
            {
                category: "AI/ML",
                technologies: [
                    { name: "OpenAI", url: "https://openai.com/" },
                    { name: "Stable Audio", url: "https://stability.ai/stable-audio" },
                    { name: "Demucs", url: "https://github.com/facebookresearch/demucs" },
                    { name: "Pedalboard", url: "https://github.com/spotify/pedalboard" },
                    { name: "CoreML", url: "https://developer.apple.com/documentation/coreml" },
                    { name: "PyTorch", url: "https://pytorch.org/" }
                ]
            },
            {
                category: "Audio",
                technologies: [
                    { name: "VST3", url: "https://www.steinberg.net/developers/" },
                    { name: "AudioUnits", url: "https://developer.apple.com/documentation/audiounit" },
                    { name: "FFmpeg", url: "https://ffmpeg.org/" }
                ]
            },
            {
                category: "Cloud",
                technologies: [
                    { name: "AWS", url: "https://aws.amazon.com/" },
                    { name: "S3", url: "https://aws.amazon.com/s3/" },
                    { name: "Lambda", url: "https://aws.amazon.com/lambda/" },
                    { name: "EC2", url: "https://aws.amazon.com/ec2/" },
                    { name: "SQS", url: "https://aws.amazon.com/sqs/" }
                ]
            },
            {
                category: "Database",
                technologies: [
                    { name: "PostgreSQL", url: "https://www.postgresql.org/" }
                ]
            }
        ],
        tags: ["mobile", "audio", "ai", "fullstack", "startup", "ios", "senior"]
    },
    {
        id: "titles-inc",
        company: "Titles, Inc.",
        position: "Senior Software Engineer",
        location: "Remote",
        startDate: "May 2024",
        endDate: "November 2024",
        description: [
            "Led development of cross-platform notification system for web3 image generation platform",
            "Built semantic image search system with Gemini multimodal embeddings and agentic asset organization",
            "Architected full-stack features across iOS, web, and backend systems"
        ],
        techStack: [
            {
                category: "Frontend",
                technologies: [
                    { name: "React", url: "https://react.dev/" },
                    { name: "TypeScript", url: "https://www.typescriptlang.org/" },
                    { name: "Tailwind CSS", url: "https://tailwindcss.com/" },
                    { name: "React Three Fiber", url: "https://docs.pmnd.rs/react-three-fiber/getting-started/introduction" }
                ]
            },
            {
                category: "Mobile",
                technologies: [
                    { name: "Swift", url: "https://www.swift.org/" },
                    { name: "SwiftUI", url: "https://developer.apple.com/xcode/swiftui/" }
                ]
            },
            {
                category: "Backend",
                technologies: [
                    { name: "Firebase", url: "https://firebase.google.com/" },
                    { name: "Cloud Functions", url: "https://firebase.google.com/docs/functions" },
                    { name: "Firestore", url: "https://firebase.google.com/docs/firestore" }
                ]
            },
            {
                category: "Cloud",
                technologies: [
                    { name: "GCP", url: "https://cloud.google.com/" },
                    { name: "Cloud Run", url: "https://cloud.google.com/run" },
                    { name: "Vertex AI", url: "https://cloud.google.com/vertex-ai" }
                ]
            },
            {
                category: "AI/ML",
                technologies: [
                    { name: "Gemini API", url: "https://ai.google.dev/" },
                    { name: "Multimodal Embeddings", url: "https://ai.google.dev/docs/multimodal_embeddings" },
                    { name: "Stable Diffusion", url: "https://stability.ai/" },
                    { name: "Flux", url: "https://fluxml.ai/" },
                    { name: "ComfyUI", url: "https://github.com/comfyanonymous/ComfyUI" }
                ]
            },
            {
                category: "Web3",
                technologies: [
                    { name: "Ethereum", url: "https://ethereum.org/" },
                    { name: "IPFS", url: "https://ipfs.tech/" },
                    { name: "Smart Contracts", url: "https://ethereum.org/en/developers/docs/smart-contracts/" }
                ]
            },
            {
                category: "DevOps",
                technologies: [
                    { name: "CI/CD", url: "https://about.gitlab.com/topics/ci-cd/" },
                    { name: "Docker", url: "https://www.docker.com/" }
                ]
            }
        ],
        tags: ["fullstack", "mobile", "ai", "web3", "multimodal", "senior", "ios"]
    }
];
const getExperiencesByTags = (tags) => {
    return exports.experiences.filter(exp => tags.some(tag => exp.tags.includes(tag)));
};
exports.getExperiencesByTags = getExperiencesByTags;
const getExperienceById = (id) => {
    return exports.experiences.find(exp => exp.id === id);
};
exports.getExperienceById = getExperienceById;
//# sourceMappingURL=experience.js.map