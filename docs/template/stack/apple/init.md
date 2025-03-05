# Apple Platform Project Setup Guide

This guide provides detailed setup instructions for getting started with your Apple platform project.

## Prerequisites

- macOS Sonoma 14.0 or later
- Xcode 15.0 or later
- Swift 5.10 or later
- Git
- CocoaPods (optional)
- Swift Package Manager

## Initial Setup

```bash
# Clone the repository
git clone [REPOSITORY_URL]
cd [PROJECT_NAME]

# Install dependencies (if using CocoaPods)
pod install

# Open the project in Xcode
open [PROJECT_NAME].xcodeproj
# or if using CocoaPods
open [PROJECT_NAME].xcworkspace
```

## Environment Configuration

### Development Team Setup

1. Open the project in Xcode
2. Select the project in the Project Navigator
3. Select the target under "TARGETS"
4. Go to the "Signing & Capabilities" tab
5. Select your development team from the dropdown

### Configuration Files

Configure your project with the appropriate `.xcconfig` files:

- **Debug.xcconfig**: Development environment configuration
- **Release.xcconfig**: Production environment configuration
- **Testing.xcconfig**: Testing environment configuration

### Environment Variables

Set up environment-specific variables in your scheme:

1. Navigate to Product > Scheme > Edit Scheme
2. Select the Run action
3. Go to the Arguments tab
4. Add environment variables under "Environment Variables"

## Development Workflow

### Building and Running

```bash
# Build using Xcode
Command+B

# Run on simulator
Command+R

# Run on device
Select your device from the device dropdown and press Command+R
```

### Managing Dependencies

#### Swift Package Manager

```swift
// Add dependencies in Package.swift
dependencies: [
    .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.8.0"),
    .package(url: "https://github.com/onevcat/Kingfisher.git", from: "7.0.0")
]
```

#### CocoaPods

```ruby
# Add dependencies in Podfile
pod 'Alamofire', '~> 5.8'
pod 'Kingfisher', '~> 7.0'
```

### Testing

```bash
# Run unit tests
Command+U

# Run UI tests
Select the UI test target and press Command+U

# Run specific test
Command+click on a test method and select "Run"
```

## Project Commands

| Command | Description |
|---------|-------------|
| `xcodebuild build` | Build the project |
| `xcodebuild test` | Run tests |
| `xcodebuild archive` | Create an archive |
| `pod install` | Install CocoaPods dependencies |
| `swift build` | Build Swift package |
| `swift test` | Test Swift package |

## Deployment

### TestFlight

1. Archive the app (Product > Archive)
2. Select "Distribute App" in the Organizer
3. Choose "App Store Connect"
4. Follow the prompts to upload
5. Configure TestFlight in App Store Connect

### App Store

1. Complete TestFlight testing
2. Submit for App Review in App Store Connect
3. Provide required metadata and screenshots
4. Submit for review

## Continuous Integration

### GitHub Actions Workflow

Create a `.github/workflows/ios.yml` file with:

```yaml
name: iOS CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: macos-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up Xcode
      uses: maxim-lobanov/setup-xcode@v1
      with:
        xcode-version: '15.0'
    - name: Install dependencies
      run: |
        pod install --repo-update
    - name: Build and Test
      run: |
        xcodebuild test -workspace [PROJECT_NAME].xcworkspace -scheme [PROJECT_NAME] -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.0'
```

## Recommended Xcode Extensions

Install the following Xcode extensions for an optimal development experience:

- SwiftLint
- XcodeGen
- SourceryPlugin
- R.swift

## Troubleshooting

### Common Issues

1. **Code signing issues**: Verify your development team and certificates
2. **Build errors**: Check Swift version compatibility
3. **Dependency issues**: Update CocoaPods or Swift Package Manager
4. **Simulator problems**: Reset the simulator or update Xcode
