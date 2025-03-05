# Apple Platform Project Structure

This template provides the recommended directory structure for modern Apple platform applications using SwiftUI and Swift Data.

## Directory Structure

```
/
├── [ProjectName]/                    # Main app target
│   ├── App/                          # App entry point and lifecycle
│   │   ├── [ProjectName]App.swift    # SwiftUI App definition
│   │   └── AppDelegate.swift         # Optional AppDelegate
│   ├── Features/                     # Feature modules
│   │   ├── Home/                     # Home feature
│   │   │   ├── Views/                # UI components
│   │   │   ├── Models/               # Data models
│   │   │   └── ViewModels/           # View state and logic
│   │   ├── Detail/                   # Detail feature
│   │   └── Settings/                 # Settings feature
│   ├── Core/                         # Core functionality
│   │   ├── Models/                   # App-wide data models
│   │   │   └── ModelContainer.swift  # Swift Data container
│   │   ├── Services/                 # App services
│   │   │   ├── NetworkService.swift  # Networking
│   │   │   └── StorageService.swift  # Data persistence
│   │   └── Utils/                    # Utilities and extensions
│   ├── UI/                           # Shared UI components
│   │   ├── Components/               # Reusable UI elements
│   │   ├── Styles/                   # SwiftUI styles
│   │   └── Modifiers/                # SwiftUI view modifiers
│   ├── Resources/                    # App resources
│   │   ├── Assets.xcassets/          # Image assets
│   │   └── Localizable.xcstrings     # Localization
│   └── Preview Content/              # SwiftUI previews
├── [ProjectName]Tests/               # Unit tests
├── [ProjectName]UITests/             # UI tests
├── Packages/                         # Local Swift packages
│   ├── FeaturePackage/               # Feature-specific package
│   └── CorePackage/                  # Core functionality package
├── [ProjectName].xcodeproj/          # Xcode project
└── [ProjectName].xcworkspace/        # Xcode workspace (if using CocoaPods)
```

## Key Files and Their Purpose

- **[ProjectName]App.swift**: Main app entry point and view hierarchy
- **ModelContainer.swift**: Swift Data model container and schema
- **NetworkService.swift**: API client and networking
- **ContentView.swift**: Root view of the application

## Development Workflow

1. **Setup**: Open the Xcode project and install any dependencies
2. **Development**: Use the SwiftUI preview to develop components
3. **Testing**: Write unit tests for models and view models
4. **Building**: Use Xcode to build for simulator or device
5. **Distribution**: Archive and upload to App Store Connect

## Common Build Schemes

- **Debug**: Development build with debugging enabled
- **Release**: Production build with optimizations
- **Testing**: Build for running tests

## Environment Configuration

- Use `.xcconfig` files for environment-specific configuration
- Configure schemes with appropriate environment settings
- Use Info.plist for app-wide configuration

Refer to tech.md for the complete technology stack details and design.md for architectural decisions.
