# Apple Platform Design System Guide

> A comprehensive guide for building modern, consistent user interfaces across Apple platforms using SwiftUI, [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines), and best practices.

## Table of Contents
- [Design Principles](#design-principles)
- [SwiftUI Architecture](#swiftui-architecture)
- [Component System](#component-system)
- [Animation System](#animation-system)
- [Accessibility](#accessibility)
- [Platform Adaptation](#platform-adaptation)
- [WidgetKit Design](#widgetkit-design)
- [VisionOS Design](#visionos-design)
- [Design Tokens](#design-tokens)

## Design Principles

### Human Interface Guidelines
- [Clarity](https://developer.apple.com/design/human-interface-guidelines/foundations/layout/)  
  Ensure text is legible and icons are crisp.  
- [Deference](https://developer.apple.com/design/human-interface-guidelines/foundations/motion/)  
  Use fluid motion and subtle interface elements that don't obscure content.  
- [Depth](https://developer.apple.com/design/human-interface-guidelines/components/animation/)  
  Provide visual layers and realistic motion to create a sense of depth.

### Complete SwiftUI Component Matrix

| Component          | iOS Variant                 | macOS Variant              | visionOS Adaptation      |
|--------------------|-----------------------------|----------------------------|--------------------------|
| Navigation         | `NavigationStack`           | `NavigationSplitView`      | 3D Spatial Navigation    |
| List               | `List` with slide actions    | Table-based List           | Volumetric Layout        |
| Controls           | Touch-optimized gestures     | Pointer interactions       | Spatial Gestures         |
| Modals             | Sheet presentations          | Popover windows            | Immersive Space          |
| Animation          | Spring-based transitions     | Subtle timing curves       | Spatial Physics Engine   |
| Widgets            | Lock Screen Widgets          | Desktop Widgets            | N/A                      |
| 3D Content         | Limited RealityKit           | Limited RealityKit         | Full Spatial Experience  |
| Spatial UI         | N/A                          | N/A                        | Glass-style Materials    |

### Platform Consistency
```swift
struct PlatformAdaptiveView: View {
    @Environment(\.horizontalSizeClass) var horizontalSizeClass
    @Environment(\.displayScale) var displayScale
    
    var body: some View {
        Group {
            if horizontalSizeClass == .compact {
                CompactLayoutView()
            } else {
                RegularLayoutView()
            }
        }
        .adaptiveFont(.headline)
        .adaptivePadding()
        .adaptiveScale(displayScale)
    }
}
```

## SwiftUI Architecture

### Advanced Composable Application Structure
```swift
protocol AppFeature: Reducer {
    associatedtype State: ObservableState
    associatedtype Action
    associatedtype View: SwiftUI.View
    
    func coreSystem() -> CoreSystem<State, Action>
    func dependencyGraph() -> DependencyValues
    func viewStore() -> ViewStore<State, Action>
}

@MainActor
struct AppCoordinator: AppFeature {
    @Observable class State {
        var path = NavigationPath()
        var home: HomeFeature.State
        var settings: SettingsFeature.State
        var widgets: WidgetState
    }
    
    enum Action {
        case home(HomeFeature.Action)
        case settings(SettingsFeature.Action)
        case navigationPathChanged(NavigationPath)
        case widgetUpdated(WidgetKind)
    }
    
    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(\.scenePhase, .active)
                .modifier(ErgonomicsModifier())
                .preference(key: AppPreferences.self, value: .init())
        }
        .environment(router)
        .modelContainer(persistence.container)
        .widgetContainer(widgets)
    }
}
```

### View Architecture
```swift
protocol BaseView: View {
    associatedtype ViewState
    var state: ViewState { get }
}

// Reusable view modifier
struct AdaptiveModifier: ViewModifier {
    @Environment(\.colorScheme) var colorScheme
    @Environment(\.horizontalSizeClass) var horizontalSizeClass
    @Environment(\.displayScale) var displayScale
    
    func body(content: Content) -> some View {
        content
            .padding(horizontalSizeClass == .compact ? 16 : 24)
            .background(colorScheme == .dark ? Color.black : Color.white)
            .environment(\.displayScale, displayScale)
    }
}

// Example implementation
struct ContentView: BaseView {
    typealias ViewState = ContentState
    @StateObject private var state = ContentState()
    
    var body: some View {
        NavigationStack {
            List {
                // Content
            }
            .modifier(AdaptiveModifier())
        }
    }
}
```

### State Management
```swift
@Observable class ViewState {
    var isLoading = false
    var data: [Item] = []
    var error: Error?
    
    func load() async {
        isLoading = true
        defer { isLoading = false }
        
        do {
            data = try await loadData()
        } catch {
            self.error = error
        }
    }
}
```

## Component System

### Base Components
```swift
struct AppButton: View {
    let title: String
    let action: () -> Void
    let style: ButtonStyle
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(.body, design: .rounded))
                .padding()
                .frame(maxWidth: .infinity)
        }
        .buttonStyle(style)
        .accessibilityLabel(title)
    }
}

struct AppCard: View {
    let content: AnyView
    let isInteractive: Bool
    
    var body: some View {
        content
            .padding()
            .background(Color.systemBackground)
            .cornerRadius(12)
            .shadow(radius: 4)
            .allowsHitTesting(isInteractive)
    }
}

struct AppWidget: View {
    let kind: WidgetKind
    let content: AnyView
    
    var body: some View {
        content
            .widgetBackground(Color.systemBackground)
            .widgetURL(kind.url)
    }
}
```

### Typography System
```swift
enum AppFont {
    case largeTitle
    case title1
    case title2
    case headline
    case body
    case callout
    case subheadline
    case footnote
    case caption
    
    var font: Font {
        switch self {
        case .largeTitle: return .system(size: 34, weight: .bold)
        case .title1:     return .system(size: 28, weight: .semibold)
        case .title2:     return .system(size: 22, weight: .semibold)
        case .headline:   return .system(size: 17, weight: .semibold)
        case .body:       return .system(size: 17)
        case .callout:    return .system(size: 16)
        case .subheadline:return .system(size: 15)
        case .footnote:   return .system(size: 13)
        case .caption:    return .system(size: 12)
        }
    }
}

extension View {
    func appFont(_ style: AppFont) -> some View {
        self.font(style.font)
    }
}
```

### Color System
```swift
struct AppColors {
    static let primary = Color("PrimaryColor")
    static let secondary = Color("SecondaryColor")
    static let accent = Color("AccentColor")
    
    static let background = Color(uiColor: .systemBackground)
    static let secondaryBackground = Color(uiColor: .secondarySystemBackground)
    
    static let label = Color(uiColor: .label)
    static let secondaryLabel = Color(uiColor: .secondaryLabel)
    
    static let separator = Color(uiColor: .separator)
    static let systemFill = Color(uiColor: .systemFill)
    
    // VisionOS-specific colors
    static let glassBackground = Color(uiColor: .systemGlass)
    static let spatialBackground = Color(uiColor: .spatialSystemBackground)
}

extension Color {
    static var adaptiveBackground: Color {
        Color(uiColor: .systemBackground)
    }
    
    static var adaptiveText: Color {
        Color(uiColor: .label)
    }
}
```

## Animation System

### Cross-Platform Motion Guidelines
```swift
struct MotionEngine {
    private let animation: Animation
    private let spring: Spring
    
    init(style: AnimationStyle) {
        switch style {
        case .interactive:
            spring = Spring(bounce: 0.3, response: 0.2)
        case .presentation:
            spring = Spring(dampingRatio: 0.86, response: 0.5)
        case .spatial:
            spring = Spring(mass: 2.0, stiffness: 1500, damping: 80)
        case .volumetric:
            spring = Spring(mass: 3.0, stiffness: 2000, damping: 100)
        }
        
        animation = .spring(
            response: spring.response,
            dampingFraction: spring.dampingRatio,
            blendDuration: 0.2
        )
    }
    
    func apply<T: VectorArithmetic>(to value: T, target: T) -> T {
        value.animated(using: spring, target: target)
    }
}
```

### Custom Animations
```swift
struct AnimationSystem {
    static let spring = Animation.spring(
        response: 0.3,
        dampingFraction: 0.7,
        blendDuration: 0
    )
    
    static let easeOut = Animation.easeOut(duration: 0.2)
    static let easeIn = Animation.easeIn(duration: 0.2)
    
    static let interactive = Animation.interactiveSpring(
        response: 0.4,
        dampingFraction: 0.8,
        blendDuration: 0.3
    )
    
    static let spatial = Animation.spatial(
        mass: 2.0,
        stiffness: 1500,
        damping: 80
    )
}

extension View {
    func springTransition() -> some View {
        self.transition(.scale.combined(with: .opacity))
            .animation(.spring(), value: true)
    }
    
    func spatialTransition() -> some View {
        self.transition(.move3D)
            .animation(.spatial(), value: true)
    }
}
```

### Transition System
```swift
struct TransitionModifier: ViewModifier {
    let isPresented: Bool
    
    func body(content: Content) -> some View {
        content
            .opacity(isPresented ? 1 : 0)
            .offset(y: isPresented ? 0 : 20)
            .animation(.spring(), value: isPresented)
    }
}

extension AnyTransition {
    static var slideUp: AnyTransition {
        .asymmetric(
            insertion: .move(edge: .bottom).combined(with: .opacity),
            removal: .move(edge: .bottom).combined(with: .opacity)
        )
    }
    
    static var move3D: AnyTransition {
        .asymmetric(
            insertion: .move(edge: .leading).combined(with: .opacity).combined(with: .scale3D),
            removal: .move(edge: .trailing).combined(with: .opacity)
        )
    }
}
```

## WidgetKit Design

Design consistent widget UIs across platforms with SwiftUI.

### Widget Example
```swift
import WidgetKit
import SwiftUI

struct SimpleWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "SimpleWidget", provider: SimpleProvider()) { entry in
            SimpleWidgetView(entry: entry)
                .containerBackground(.gray.gradient, for: .widget)
        }
        .supportedFamilies([.systemSmall, .systemMedium])
        .configurationDisplayName("Simple Widget")
        .description("A simple widget example")
    }
}

struct SimpleWidgetView: View {
    let entry: SimpleEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        VStack {
            Text(entry.date, style: .time)
                .appFont(.headline)
            if family != .systemSmall {
                Spacer()
                Text(entry.description)
                    .appFont(.caption)
            }
        }
        .padding()
    }
}
```

## VisionOS Design

Design guidelines for spatial computing and volumetric interfaces.

### Spatial Layout
```swift
struct SpatialLayoutView: View {
    var body: some View {
        VStack {
            Text("Welcome to Spatial Computing")
                .font(.system(.largeTitle, design: .rounded))
                .spatialEffect(.glassBackplate)
            
            HStack {
                ForEach(items) { item in
                    ItemView(item: item)
                        .spatialEffect(.floatingCard)
                }
            }
            .spatialArrangement(.volumetric)
        }
        .spatialPadding()
        .glassBackgroundEffect()
    }
}
```

### Volumetric Components
```swift
struct VolumetricCard: View {
    let content: AnyView
    let depth: CGFloat
    
    var body: some View {
        content
            .padding()
            .background(.ultraThinMaterial)
            .cornerRadius(20)
            .volumetricEffect(depth: depth)
            .shadow(radius: 8)
    }
}
```

## Design Tokens

### Complete Design Token System
```swift
enum DesignSystem {
    static let spacing = Spacing()
    static let typography = Typography()
    static let color = ColorPalette()
    static let motion = MotionSettings()
    static let shape = ShapeSystem()
    static let elevation = Elevation()
    static let spatial = SpatialSystem()
}

extension DesignSystem {
    struct Spacing {
        let base: CGFloat = 8
        let scale: [CGFloat] = [0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8].map { $0 * base }
        
        func value(_ multiplier: CGFloat) -> CGFloat {
            base * multiplier
        }
    }
    
    struct Typography {
        let dynamicScale = Font.Design.system...Font.Design.rounded
        let typeScale = UIFont.TextStyle.headline...UIFont.TextStyle.caption2
        let weights = [Font.Weight.light, .regular, .medium, .semibold, .bold]
        
        func scale(for sizeClass: UserInterfaceSizeClass) -> CGFloat {
            sizeClass == .compact ? 0.9 : 1.1
        }
    }
    
    struct Elevation {
        let levels: [CGFloat] = [0, 2, 4, 8, 16, 24]
        let opacityRange = 0.1...0.4
    }
    
    struct SpatialSystem {
        let depths: [CGFloat] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
        let volumetricScale = 1.0...2.0
        let glassOpacity = 0.3...0.7
    }
}
```

## Best Practices

1. **Layout Guidelines**  
   Use safe areas and margins. Consider device orientation and dynamic type.  
2. **Color Usage**  
   Support dark mode. Maintain sufficient contrast.  
3. **Typography**  
   Use system fonts. Follow hierarchical structures. Support dynamic type.  
4. **Interaction**  
   Provide haptic feedback where appropriate. Implement accessible gestures.  
5. **Spatial Design**  
   Consider depth and volume. Use glass materials appropriately.  
6. **Widget Design**  
   Keep widgets focused and glanceable. Support all relevant families.  

## Resources

- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)  
- [SwiftUI Documentation](https://developer.apple.com/documentation/swiftui)  
- [SF Symbols](https://developer.apple.com/sf-symbols)  
- [Accessibility Guidelines](https://developer.apple.com/accessibility)  
- [Design Resources](https://developer.apple.com/design/resources)
- [VisionOS Design Guidelines](https://developer.apple.com/design/human-interface-guidelines/visionos)
- [WidgetKit Guidelines](https://developer.apple.com/design/human-interface-guidelines/widgets)

Note: Keep this document updated with the latest versions and best practices. Always check the official Apple documentation for the most recent changes. 