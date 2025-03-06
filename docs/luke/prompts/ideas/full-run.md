INIT PROMPT::


ai native app for gen alpha / gen z audience - be real with ai - empathy/playful/fun/utilitarian

//

# Official Glossary: Cutting-Edge AI-Native Vercel Applications (2024)

This curated glossary details the toolkit, frameworks, AI libraries, databases, infrastructure, and inspirations ideal for building cutting-edge AI-native (Web4) applications leveraging Next.js, React, Vercel, Neon, Upstash, and advanced web paradigms.

---

## 🚀 **Main Framework & Platform**

- **[Vercel](https://vercel.com)**  
  Serverless platform optimized explicitly for Next.js apps, supporting edge rendering, KV storage, vector databases, and AI-native workflow integration.

- **[Next.js v15](https://nextjs.org/docs)**  
  React framework ensuring robust server components, server actions, parallel routes, and edge-native execution for AI-heavy workloads.

- **[React 19](https://react.dev/)**  
  Major update emphasizing concurrent rendering, efficient hydration strategies, and automated data fetching improvements aligned with AI workflows.

- **[Tailwind CSS v4](https://tailwindcss.com/docs/installation)**  
  Utility-first CSS for rapid, sensible, and minimalistic UI creation.

---

## 📚 **UI & UX Tooling**

- **[shadcn/ui](https://ui.shadcn.com/)**  
  A customizable component library built on Radix UI and Tailwind CSS.

- **[Radix UI](https://radix-ui.com)**  
  Accessible, unstyled UI primitives tailored for building minimalist yet robust interfaces.

- **[Phosphor Icons Duotone](https://phosphoricons.com)**  
  Modern icon set ideal for monochromatic, high-contrast minimalistic design languages.

---

## 🛢️ **Database & Storage**

- **[Neon](https://neon.tech/docs)**  
  Serverless PostgreSQL database optimized for Vercel Edge Functions, including built-in support for edge-friendly database querying ([neondatabase/neon-vercel-kysely](https://github.com/neondatabase/neon-vercel-kysely), [neondatabase/neon-vercel-rawsql](https://github.com/neondatabase/neon-vercel-rawsql)).

- **[Upstash](https://upstash.com/docs)**  
  Serverless Redis platform providing KV (Key-Value) and Vector storage, essential for AI application persistence, embeddings, semantic search, and user sessions ([upstash/jstack](https://github.com/upstash/jstack)).

- **[Vercel Blob](https://vercel.com/blog/vercel-storage)** *(currently in Private Beta)*  
  Built-in file storage solution for media, content uploads, and static asset hosting within the Vercel ecosystem.

---

## ⚙️ **Data & API Management**

- **[Prisma](https://www.prisma.io/docs)**  
  Type-safe ORM simplifying data access layer, smoothly interoperable with Neon.

- **[tRPC](https://trpc.io/docs)**  
  Provides end-to-end type safety for building APIs paired seamlessly with Prisma and Zod.

- **[SWR](https://swr.vercel.app)**  
  React Hooks-based data fetching layer offering automatic caching, real-time updates, and dynamic loading states.

- **[Kysely](https://github.com/koskimas/kysely)** *(optional advanced usage)*  
  Type-safe SQL query builder designed for efficient edge-native Neon DB interactions ([neondatabase/neon-vercel-kysely](https://github.com/neondatabase/neon-vercel-kysely)).

---

## ✅ **Validation, Authentication, and Security**

- **[Zod](https://zod.dev)**  
  Robust schema validation and parsing library providing comprehensive TypeScript support.

- **[Auth.js (NextAuth)](https://authjs.dev)**  
  Secure, scalable authentication solution designed for Next.js serverless architectures.

- **Passkeys** *(future-leaning consideration)*  
  Modern, passwordless authentication using device-bound passkeys. Ideal for fully leveraging secure, user-friendly web authentication experiences.

---

## 🧪 **Testing & Mocking**

- **[MSW (Mock Service Worker)](https://mswjs.io)**  
  Seamless API mocking, streamlining rapid frontend development even before real backend services are finalized.

---

## 💡 **AI & Agentic Frameworks**

- **[Mastra](https://mastra.ai)**  
  AI-native framework built for complex, agent-driven workflows and conversational interfaces, enabling sophisticated intelligent user experiences.

- **[Priompt](https://priompt.dev)**  
  Innovative prompt engineering toolkit designed for optimizing prompts, reducing AI model latency, and managing complex prompting scenarios.

---

## 🎯 **State Management & Animations**

- **[Zustand](https://github.com/pmndrs/zustand)**  
  Lightweight global store architecture optimized for React state management.

- **[Jotai](https://jotai.org/docs/introduction)**  
  Atomic state management, enabling fine-grained, performant reactivity and composable state primitives.

- **[Framer Motion](https://framer.com/motion)**  
  Advanced UI animation library shaping silky smooth, generative web interactions.

- **[Auto-Animate](https://auto-animate.formkit.com/)**  
  Easy-to-integrate automatic animations responding intuitively to UI state transitions.

---

## 🔐 **Edge Infrastructure & Environment Management**

- **[Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)**  
  Globally distributed runtime for lightning-fast backend execution, well-integrated with Neon DB and Upstash KV/Vector stores.

- **Environment Management**  
  Leveraging native Vercel CLI for managing (`DATABASE_URL` and other sensitive variables) simplifies local and production environment configuration ([neondatabase/neon-vercel-rawsql](https://github.com/neondatabase/neon-vercel-rawsql)).

---

## 🎨 **Design Ethos & Principles**

| Principle            | Description                                           | Tech                          |
|----------------------|-------------------------------------------------------|-------------------------------|
| **Minimalism**       | Embracing simplicity, clarity, and removing noise.    | Tailwind CSS, Radix UI        |
| **Utilitarianism**   | Interface and interactions justified by clear utility.| shadcn/ui, Zustand, Jotai     |
| **Typography**       | Left-aligned, monospace font with web2 clarity.       | [Iosevka](https://typeof.net/Iosevka/) |
| **Color Scheme**     | Monochromatic, high-contrast, neu-minimalist visuals. | Tailwind CSS Palette          |
| **Interaction**      | Subtle, clear animations aid usability at transitions.| Framer Motion, Auto-Animate   |

---

## 🌟 **Inspirational References**

- [Vercel v0](https://vercel.com/design) — Minimal yet expressive UI clarity.
- [Linear](https://linear.app) — Streamlined productivity-first experiences.
- [Arc Browser](https://arc.net) — Clean UI combined with delightful AI interactions.
- [Rabbit R1](https://rabbit.tech/r1) — Functional yet emotionally minimal tech interfaces.
- [Teenage Engineering](https://teenage.engineering) — Hardware minimalism for digital metaphors.

---

## Further Reading & Resources (New Additions)

- [Passkeys Authentication Demo](https://github.com/nealfennimore/passkeys) – Advanced passwordless auth approach with Cloudflare Workers, KV storage, and D1 databases.
- [jStack](https://github.com/upstash/jstack) – Opinionated Next.js dev stack emphasizing low-cost serverless apps inspired by T3 Stack—excellent guidance for integrating Upstash with Next.js.
- [Neon Edge Integration Patterns](https://github.com/neondatabase/neon-vercel-kysely) – Production patterns for Neon DB integration with Vercel Edge Functions.

---

This refined and carefully expanded glossary represents the current state-of-the-art in building performant, secure, minimalistic, AI-native Vercel & Next.js applications, providing actionable guidance, officially linked docs, and inspirational benchmarks for developing exceptional web4 experiences.

//

inspiration:

This file is a merged representation of the entire codebase, combining all repository files into a single document.
Generated by Repomix on: 2025-03-06T08:43:34.013Z

================================================================
File Summary
================================================================

Purpose:
--------
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

File Format:
------------
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Multiple file entries, each consisting of:
  a. A separator line (================)
  b. The file path (File: path/to/file)
  c. Another separator line
  d. The full contents of the file
  e. A blank line

Usage Guidelines:
-----------------
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

Notes:
------
- Some files may have been excluded based on .gitignore rules and Repomix's
  configuration.
- Binary files are not included in this packed representation. Please refer to
  the Repository Structure section for a complete list of file paths, including
  binary files.

Additional Info:
----------------

================================================================
Directory Structure
================================================================
inspiration/
  addressable-ai-agents.md
  event-bus.md
  full-stack-ai-agents.md
  local-first-ai-agents.md
  prompt-design-arvid.md
  reliable-ux-durable-obj.md
  task-tracking.md
memory/
  bank_00.md
  bank_10.md
  bank_11.md
tools/
  mastra/
    index.md
    memory.md
    workflow.md
  priompt/
    index.md
    usage.md
architecture.md
core-components.md
example-implementation.md
integration-guide.md

================================================================
Files
================================================================

================
File: inspiration/addressable-ai-agents.md
================
Title: call me maybe

URL Source: https://sunilpai.dev/posts/addressable-ai-agents/

Published Time: 2025-02-10T00:00:00.000Z

Markdown Content:
10 February 2025

AI agents should be addressable

(thanks to ashley peacock ([github](https://github.com/apeacock1991)/[twitter](https://x.com/_ashleypeacock)) for inspiring me to write this. he built [an ai agent to manage customer service simultaneously with email/chat](https://x.com/_ashleypeacock/status/1886855862670782552) that got me thinking about this. follow him, [buy his book](https://pragprog.com/titles/apapps/serverless-apps-on-cloudflare/))

we’ve already touched around this in different ways with [full stack ai agents](https://sunilpai.dev/posts/full-stack-ai-agents), the ability to [assign tasks](https://sunilpai.dev/posts/ai-agents-need-tracking/), which all imply that ai agents should be addressable in some way; some way to “talk to them”, identify them. concretely, this means that an ai agent should have a URL, and an email address (and a phone number?), maybe more.

building agents on durable objects already mean they’re addressable inside a Worker with a DO namespace + id, but we can go further and make them addressable from the outside. let’s generalize ashley’s example. we make a helper function that wraps the root worker to intercept http requests/websockets, and email. If a new email comes in to [help@domain.com](mailto:help@domain.com), we route it to a new agent. you can also email the agent directly. you can also visit /agents/:id to interact with the agent with a chat interface. inside the agent, we can tell whether a user is currently connected to a websocket or not(via the ui), and we use that to decided whether to respond via UI or via email. (tell me, what else could we do with this?)

```
class Agent extends Server<Env> {
  constructor(ctx, env) {
    super(ctx, env);
    // let's setup a table to store messages
    // wherever they come from
    this.ctx.storage.sql.exec(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT,
    source TEXT CHECK(source IN ('email', 'http', 'websocket')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  }
  step(data: string, source: string): string {
    this.ctx.blockConcurrencyWhile(async () => {
      this.ctx.storage.sql.exec(`INSERT INTO logs (data, source) VALUES (?, ?)`, data, source);
      // run an LLM step to reply
      return "this would be a reply based on everything in logs";
    });
  }

  onMessage(connection, message) {
    const reply = this.step(message, "websocket");
    connection.send(reply);
  }
  onEmail(email: Email) {
    const reply = this.step(email.body, "email");
    email.reply(reply);
  }

  onRequest(request: Request) {
    const reply = this.step(request.body, "http");
    return new Response(reply);
  }
}
type Env = {
  agents: DurableObjectNamespace<Agent>;
};

function routeAgents<Env>(handler: ExportedHandler<Env>): ExportedHandler<Env> {
  return {
    async fetch(request, env, ctx) {
      const { pathname } = new URL(request.url);
      let match;
      if (/\/agents\/[a-zA-Z0-9_-]+/.test(pathname)) {
        match = pathname.match(/\/agents\/([a-zA-Z0-9_-]+)/);
        if (match) {
          const agentId = match[1];
          const agent = env.agents.get(agentId);
          // forward websockets and requests to the agent
          return await agent.fetch(request);
        }
      }
    },
    email: async (email, env, ctx) => {
      let agentId: string;
      let match;
      if (email.to === "hello@domain.com") {
        agentId = `agent-${Math.random().toString(36).substring(2, 15)}`;
      } else if (email.to.match(/^agent\//)) {
        match = email.to.match(/^agent\-([a-zA-Z0-9_-]+)/);
        if (match) {
          agentId = match[1];
        } else {
          // route to default
          agentId = "default";
        }
      }
      // route emails to the agent
      const agent = env.agents.get(agentId);
      return await agent.onEmail(email);
    },
    queue(batch: messages) {
      // ...
    },
  };
}

// now we can do this:

export default routeAgents({
  fetch: async (request, env, ctx) => {
    // any requests that reach here aren't for agents
    return new Response("hello from the root worker");
  },
});
```

the code is quite straightforward since we have a single thread for a durable object. I would use partysync to simplify websockets and ui boilerplate, of course. (should probably also get an email helper like the above into the partyserver family of libraries soon.)

with this code, we now have a way to route emails to agents, and a way to route websocket connections to agents. we can also visit /agents/:id to interact with the agent with a chat interface (implementing that is left as an exercise to the reader).

not a groundbreaking idea, but certainly a useful one. it also starts giving shape to another idea, which is that “agents” might not actually have much to do with LLMs after all, they’re just containers for execution, that you stuff with capabilities, observability, and a rube goldberg machine that does things. feels like a good mental model to keep in mind.

![Image 1: agent-container](https://sunilpai.dev/_astro/agent-container.qNpHjBet_ECE2x.webp)

(twitter: [https://x.com/threepointone/status/1888763110200115368](https://x.com/threepointone/status/1888763110200115368))

================
File: inspiration/event-bus.md
================
Title: an event bus for ai agents

URL Source: https://sunilpai.dev/posts/an-event-bus-for-ai-agents/

Published Time: 2025-02-27T00:00:00.000Z

Markdown Content:
27 February 2025

it is very professional yes

*   agents can expose http/ws hooks, email hooks, or arbitrary function calls
*   agents can be triggered by http/ws, email, or… (?)

every automation system has some form of an “event bus”, whether explicit/implicit. it lets us use vocabulary like “when a new user signs up, send them an email”. the naive way of implementing this is to add the email sending logic in the http handler where a user signs up. but the professional way is to push an event on to a queue, and to have a something (usually a workflow) consume that queue event and send that email. this gives us retries, decoupling, all the good things queues give you. you might see where I’m going with this:

```
class MyAgent extends Agent {
  onUserSignup() {
    // ... let the robot brain decide what to do next
  }
}

export default {
  async queue() {
    for (const message of batch.messages) {
      if (message.type === "user.signup") {
        (await getAgentByName(env.MyAgent, message.email)).onUserSignup(message);
      }
    }
  },
};
```

![Image 1: event bus for ai agents](https://sunilpai.dev/_astro/event-bus-ai-agents.HIU51tka_ZzUyj9.webp)

so instead of passing the event explicitly/deterministically on to a workflow, let an agent intercept it and “decide” what to do next. is the user currently connected to the agent chat? then ping them right there. maybe schedule some action to happen later (in 7 days, send an email if they haven’t made a project yet). etc etc.

standard automation queues might be too noisy here (though probably worth a first implementation) but I suspect there will be a subset of (enriched) events that get passed on to another queue only for consumption by agents.

and of course, the agents could push events back on to the bus…

================
File: inspiration/full-stack-ai-agents.md
================
Title: Full Stack AI Agents

URL Source: https://sunilpai.dev/posts/full-stack-ai-agents/

Published Time: 2025-02-02T00:00:00.000Z

Markdown Content:
![Image 1: no-more-automagic](https://sunilpai.dev/_astro/no-more-automagic.c-5qyNku_Z1OlNlM.webp)

what if you gained root access into an agent’s brain? what would it look like?

![Image 2: smith](https://sunilpai.dev/_astro/smith.w24ASApW_Z9jlWr.webp)

ai agents are little long running processes that are “doing stuff” in the background. business processes, personal automation, chatbots, workflows, etc. durable objects are a fantastic fit as containers for these agents. (here’s a video where I talk about running the anthropic agent patterns inside durable objects [https://x.com/threepointone/status/1884783568603246802](https://x.com/threepointone/status/1884783568603246802), longform post coming soon). now sure, we can build an application ui for the experience. but… how do we look _inside_ what the agent is doing? we could log metrics and events, and stream them somewhere, but this thing is a living-ish thing. like any other workflow/automation, we sure would like to to be able peer INSIDE these agents to see what’s happening.

i.e., not only do agents have input/output/state, they also should have a ui! call it root, an admin panel, a dashboard, whatever. conceptually, every Agent should have a `render()` method that lets your root around its innards, see what’s happening, and even modify the agent’s state.

(right?! right?!)

![Image 3: ghost in the shell](https://sunilpai.dev/_astro/ghost-in-the-shell.OvIgCe3v_ZolUca.webp)

Here’s an example; let’s say we have a (multiplayer) chat interface. We have a durable object `ChatRoom` for each chat session, that clients connect to. A simple method of adding “ai” to this chat would be to add a handler inside this chat durable object that responds to every message with an ai generated response (indeed, that’s what the official template recommends, and it works well.) for the sake of this example, tho, let’s make it a bit more interesting. we’ll make an `Agent` that connects to the chat, that can see and respond to the messages, but also has its own ai-specific `render()` method.

```
// pseudo code

class ChatRoom extends DurableObject {
  onMessage(message: string) {
    this.broadcast(message); // this will send the message to all connected clients
  }

  render() {
    return (
      <div>
        <h1>Chat Room</h1>
        <Chat />
      </div>
    );
  }
}

class Agent extends DurableObject {
  constructor() {
    // connect to the chat room
    this.connect(Room.get("some-room-name"), {
      onMessage: (message: string) => {
        // do something with the message
        // like reply, analyze, do tool calls, etc
      },
    });
  }

  render() {
    if (!this.isAdmin()) return null;
    return (
      <div>
        <h1>Chat Agent control panel</h1>
        {/* a bunch of buttons to do stuff inside the agent */}
        <Actions />
        {/* a log of everything that's happened inside the agent */}
        <Logs />
      </div>
    );
  }
}
```

We then setup urls so that everything on `/chat/:id` will be handled by the `ChatRoom` durable object, rendering a chat ui as expected. but we’d also like to have a `/agent/:id` url, that will be handled by the `Agent` durable object. (You’d probably also setup some auth so that only admin users can access the agent. whatever works for you, a discussion for later.)

![Image 4: architecture](https://sunilpai.dev/_astro/architecture.uboTbMSV_1K2Oi4.webp)

“hidden” from the rest of the app, the agent now has its own state/persistence, and we can implement functionality that’s unique to it. in this example, let’s use a reasoning model to generate a response. we’ll hide the actual “reasoning” output from the chat room, and only send the final response. further, we can now add a ui to the agent, and have it render itself. we’ll implement this agent with partysync as well, so that a browser can connect to it and see the agent’s state/ui.

![Image 5: chat ui](https://sunilpai.dev/_astro/chat-ui.Q2I8_4BS_Z1PQIQm.webp)

with this setup, every agent now becomes a proper server, a full stack web app, with its own ui. there’s nothing stopping us from building fully interactive apps that could modify the agent, send it input/output, etc. a whole new world opens up. you could “login” to an agent, and temporarily give it a new persona, or even a new model. maybe share credit card details while it’s trying to make a transaction, and then delete the data to make it “forget” it. change it’s prompt midway. perhaps even give it a new model.

Now, let’s talk about how we can build this. First, a sidequest about some recent developments that make this possible.

[vite](https://vite.dev/) is a dev/build tool that is super popular in the javascript ecosystem. it started out as a tool for building plain frontend apps, but now works for server side code, etc. it’s pretty great. it’s particularly nice when building both frontend and backend together, in the same project (so called “full stack apps”).

of note, everyone loves the developer experience of `vite dev` - it’s really fast, there’s an amzing ecosystem of plugins, which you can mix and match for your own stack. some folks might know I’ve [been vite-pilled for a while now](https://sunilpai.dev/posts/esbuild-with-jason/) (we were so young…), so I’m not even parroting the narrative; I _set_ the damn narrative you common folks consume. I would never shill a product simply because I’m employed by them, or have any financial incentive to make people use it.

ahem. anyway.

cloudflare workers is the world’s best platform for running your javascript. the key thing is a custom javscript runtime [workerd](https://github.com/cloudflare/workerd) (built on v8) that is optimized for serverless environments; which gives it magic powers like zero start up time (and it’s [super clever how that works](https://blog.cloudflare.com/eliminating-cold-starts-with-cloudflare-workers/)), running on a planetary netowkr in hundreds of cities and thousands of points of presence. this custom runtime has unique apis (that are inspired by standards) that make it a joy to work with; in addition to stuff like `fetch`, `Request`, `Response`, `WebSocket`, `caches`, etc, it has [durable objects](https://developers.cloudflare.com/durable-objects/what-are-durable-objects/), which is the actor model, but for javascript. (I have written about durable objects before: [1](https://sunilpai.dev/posts/the-future-of-serverless/), [2](https://sunilpai.dev/posts/spatial-compute/), [3](https://sunilpai.dev/posts/durable-objects-are-computers/))

the local dev experience is powered by [wrangler](https://github.com/cloudflare/wrangler), which is a cli tool for working with cloudflare workers. among other things, it handles all the boring stuff like compiling your code and dependencies, and running it inside workerd.

`vite dev` is vite’s story for local development. it handles all the boring stuff like compiling your code and dependencies… but then for server side code, it uses node. DAMMIT. sure, node now supports standards APIs like `fetch`, `Request`, `Response`, etc, but I can’t run workerd-specific stuff durable objects in it. there are workarounds, but they’re not ideal. you’d have to build your frontend application with vite dev, and run wrangler in parallel for the backend, it was all very fidgety and not satisfying.

vite 6 fixes that specific problem. tl;dr - [with the new environment api](https://vite.dev/blog/announcing-vite6#experimental-environment-api), you can now run your code inside _any_ custom runtime.

peeps inside cloudflare have been furiously working then on making `vite dev` work with workers. to have a great integrated experience when building an app that targets browser sand workers (and maybe even others? like node, react-native, deno, etc) at the same time. [they just started shipping 0.0.x versions of the plugin](https://npmjs.com/package/@cloudflare/vite-plugin), which means it’s time to start playing with it!

(the big caveat here is that existing frameworks still have to change code to support this. that’s a process that’s underway, but it’s only a matter of time before it’s done.)

building this without as two separate apps would’ve been a complete fucking pain in the ass. it would’ve been doable, but the amount of back and forth and operational complexity… just thinking about it would’ve been a nightmare. but now I can build this whole app as a single concept, with great dx to just ship when I’m done.

so… that’s the thing. full stack ai agents. does your ai agent have a ui, anon?

(video: [https://x.com/threepointone/status/1886214582253089179](https://x.com/threepointone/status/1886214582253089179))

================
File: inspiration/local-first-ai-agents.md
================
Title: ai agents are local first clients

URL Source: https://sunilpai.dev/posts/local-first-ai-agents/

Published Time: 2025-02-16T00:00:00.000Z

Markdown Content:
(did sunil really make a title with TWO hyped up topics? yes he did.)

first, the punchline.

![Image 1: local first pmf](https://sunilpai.dev/_astro/local-first-pmf.Mh8JZeT7_Z2sMmQY.webp)

let’s start with a mental model of how you would build an app. conceptually, it’s a machine with configuration, state, and “methods”/ functions that you can call on them with arguments to affect change. we might represent it in code like this:

```
// let's say we're building a todo app
const app = {
  config: {
    darkMode: false,
    language: "en",
  },
  state: {
    todos: [],
    input: "",
  },
  methods: {
    toggleDarkMode: () => {
      app.config.darkMode = !app.config.darkMode;
    },
    addTodo: (todo: string) => {
      app.state.todos.push({
        id: crypto.randomUUID(),
        title: todo,
        completed: false,
      });
      app.state.input = "";
    },
    removeTodo: (index: number) => {
      app.state.todos.splice(index, 1);
    },
    // ...
  },
};
```

with a machine like this, we can build a ui for the todo app. it might look like this in react:

```
function TodoApp() {
  return (
    <div>
      <input value={app.state.input} onChange={(e) => app.methods.setInput(e.target.value)} />
      <button onClick={() => app.methods.addTodo(app.state.input)}>Add Todo</button>
      {app.state.todos.map((todo) => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => app.methods.toggleTodo(todo.id)}
          />
          <span>{todo.title}</span>
          <button onClick={() => app.methods.removeTodo(todo.id)}>Remove</button>
        </div>
      ))}
      <button onClick={() => app.methods.toggleDarkMode()}>
        {app.config.darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
}
```

nice. now of course, this has to actually persist to a server/database somewhere. so we’d do somthing like this in our methods:

```
methods: {
  // ...
  saveTodos: async () => {
    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify(app.state.todos),
    });
  },
};
```

and we’d await it in our addTodo method:

```
addTodo: async (todo: string) => {
  app.state.todos.push({
    id: crypto.randomUUID(),
    title: todo,
    completed: false,
  });
  await app.methods.saveTodos();
};
```

cool. we now have a todo app that persists to a server.

(now the nerds in the audience are probably pissed because this doesn’t wire up to a react rerender, and might show view tearing, and we’re not using any state management library, whatever. don’t care, this post isn’t about those specifics, it’s about the mental model. get bent losers.)

in a real app, you’d use a state management library that formalises this relationship between state, ui, and methods. (e.g. redux has “actions” and “reducers” for this that act on a “store” of state, and rerender on every state change.)

on the server side, you’d mirror this structure. it might look like this:

```
const server = {
  state: {
    todos: [],
  },
  methods: {
    getInitialState: async () => {
      const todos = await sql.query("SELECT * FROM todos");
      return { todos };
    },
    addTodo: async (todo: string) => {
      await sql.query("INSERT INTO todos (title) VALUES (?)", todo);
    },
    // ...
  },
};
```

this gives an architecture that gives us “separation of concerns” - the ui acts as “client” and the server acts as a, er, “server”. the server only cares about the data and some “business logic”, independent of the clients/uis that will be built to interact with them. importantly, the server provides apis to 1. gather context about the system being manipulated, 2. perform actions on the system.

a lot of this is boilerplate, and has led to the rise of “local first” systems in building UIs. these systems usually have a “sync engine” that handles syncing most/state state between the client and ther server, and the client then performs “actions”/“mutators” that 1. optimistically updates the state/ui on the client 2. sends the action to the server where it gets executed (with any other database updates/side effects), and then 3. confirms and commits the action on the client side. it’s like git, but for uis. very demure, very mindful. of note, they leverage persistence systems on the browser side (via indexxeddb, or localstorage, or file system apis) to persist state, so they don’t have to fetch the entire server side state on restarts etc. particularly great for highly interactive apps.

I recommend going to [this site](https://localfirstweb.dev/) to learn more, see what different flavours exist, and get a sense of the ecosystem. there’s also a great post on sync engines by [Adam Nyberg](https://x.com/Adam_Nyberg): [https://adamnyberg.se/blog/2025-02-11-real-time-sync-engines/](https://adamnyberg.se/blog/2025-02-11-real-time-sync-engines/) that includes this neat diagram:

![Image 2: sync engines](https://sunilpai.dev/_astro/sync-engines.uS-Tt327_1Dxzax.webp)

anyway. ai agents. these are processes that act on a “state” and “methods” of a “machine”. they connect to data sources and perform actions on the machine. they use the context of the machine to make decisions. and users (us) can interact with them. they benefit from fast startup time, and usually have access to their own internal persistence system to maintain that context over long periods of time.

sounds very similar to a ui/browser/client, right?

in this very nascent period of growth for ai agents, they’re being built as stateless systems, just like browser apps were built before sync engines were a thing; workflows initialise and grab a whole bunch of state and context from disparate systems, and explcitly call async apis that affect change, and then discard it all after a “goal” is reached. this isn’t ideal, agents are meant to long running processes that can “sleep”/pause and resume, and they’re meant to be able to act on long term context.

I contend that ai agents should be built exactly like local first apps/clients. every agent should be able to connect to a “server” that provides the context of the system, sync that state over to it’s own persistence system, and perform actions on the system. while this has the immediate benefit of reducing boilerplate while building agents, it also means that the entire system (a browser client app, the mobile app, the ai agents) can be iterated on and deployed without worrying about api drift and inconsistency. and (brace yourself for some shilling) this means that your ai agent infrastructure should probably be stateful (_cough_ durable objects _cough_).

I explored this in the [full stack ai agents](https://sunilpai.dev/posts/full-stack-ai-agents/) post. the ai agent durable object connects to the chat server durable object, and slurps down the state of the chat room, and then uses that to performa analysis on the chat history. this is built on my (wip) sync engine [partysync](https://github.com/threepointone/partyserver/tree/main/packages/partysync) (I should push up the code that syncs across DOs soon.)

so, that’s the pitch. if you’re building a local first system, I highly encourage you to consider making sure they’re “isomorphic” so that they can run in a browser, mobile app, or ai agent. (yes I just added a third hype word to this!) and use a platform that [makes this part easy, so you can focus on the business logic](https://x.com/threepointone/status/1889661957520736622).

find me on twitter and let’s talk about this post. [https://x.com/threepointone/status/1891199382428557459](https://x.com/threepointone/status/1891199382428557459)

================
File: inspiration/prompt-design-arvid.md
================
Title: Prompt Design

URL Source: https://arvid.xyz/posts/prompt-design/

Published Time: 2023-06-11 13:42:16 -0800 -0800

Markdown Content:
I’m usually averse to the common habit of trying to find old-world analogues to new-world phenomena. So please bear with me as I commit that exact sin: **let me present the case for why prompting should be called _prompt design_ and be likened to web design.**

I view prompting as communicating with a time-constrained human. While LLM-specific techniques are certainly helpful (most notably chain-of-thought), I’ve found that one of the best ways to improve performance is to just have extremely clear and high-quality instructions, similarly to how clarity and conciseness helps real humans understand better too.

_Prompting-as-clear-communication_ makes prompting sound like writing. Most of the prompting I am doing, however, is parametric: I have a number of input variables, and need to dynamically adapt my prompt to those.

Hence, _prompting-as-clear-communication-with-dynamic-input_ feels like the most accurate characterization.

What other field is about communicating clearly with dynamic input? Web design.

Let’s list out all the similarities. Prompting and web design both:

1.  require clarity, and have communication as the primary goal;
2.  need to respond to dynamic content, unlike writing or magazine layout; and
3.  need to adapt their content to different sizes — screen sizes for web design, context windows for prompting.

In my experience from doing both prompting and web design, I’ve also found that I have similar developer preferences in the two areas:

1.  _Looking at the actual prompt_ is super important, just like _looking at the rendered website_ is super important. I cannot design a website if I have to simulate the HTML and CSS rendering process in my mind. Similarly, it is really hard to write good and clear prompts without looking at the rendered output of a prompt with all input variables filled in.
    *   For example, the prompt `"Hi ${username} ${message}"` may look reasonable, until you render it and realize that the user name blends in with the message.
2.  Composable components are useful in both prompting and web design.
3.  Declarative is better than imperative for both. It is really hard to change a website where all HTML elements are created with `document.createElement` calls. Similarly, reading and changing a prompt that consists of a long sequence of `str += "..."` easily becomes unmanageable.
4.  In both, I sometimes want to achieve “pixel perfection”. When prompting less capable models (GPT-3.5 and worse), I want to make sure that I have no extraneous newlines or other types of imperfect formatting, and when designing a website, sometimes every pixel matters.

For LLM agents, it is possible to take the analogy even further: agent prompting can be seen as building an interactive website for the agents, where they can “click buttons” by calling functions, and where the prompt re-renders in response to a function call, just like a website re-renders in response to a button click.

Of course, there are differences between prompt design and web design:

1.  Prompting deals with text only (for now!).
2.  Caching is different: for agents in particular, you want to make sure that your re-renders are cheap by only changing the later parts of the prompt. There’s a contrived parallel here to the web (you want to cache-optimize your website), but I think it is fundamentally quite a different challenge.

Still, the similarities have convinced me that prompting should be called _prompt design_, not _prompt engineering_. Writing a prompt _feels just like designing a website_, and should thus be named the same way too.

The prompt design perspective inspired me to create [Priompt](https://github.com/anysphere/priompt), a React-like, JSX-based prompt design library.

### Priompt v0.1: a first attempt at a prompt design library

[Priompt](https://github.com/anysphere/priompt) is a first attempt at creating a prompt design library inspired by modern web design principles. We are using it internally at [Anysphere](https://anysphere.co/), and we like it a lot.

I think it is probably not exactly correct in all of its abstractions, but I am at least convinced that JSX is a far more ergonomic way to write prompts than string templates. Even the simple thing of trivially being able to comment out parts of your prompt makes the iteration loop much faster.

![Image 1: Prompting using JSX.](https://arvid.xyz/example-prompt.png)

What prompting as JSX looks like.

Priompt also comes with a (very hastily put together) preview website, where you can preview your prompt on real data. When developing your application, you can log the serialized `props` coming into a component on every request. Then, when you see unexpected behavior, you can go to the Priompt preview, look at the exact prompt, and change the source code and have the prompt update with the same `props` as the real request. We’ve found that this makes it easier to iterate on prompts.

![Image 2: Priompt preview screenshot.](https://arvid.xyz/priompt-screenshot.png)

Previewing prompts.

If you try it out, please let me know your thoughts! I’d love to see more ideas in the same vein, or just be told that I’m completely wrong and prompt design is stupid :).

### Caveats

Models change quickly, and so too do prompting techniques have to. With that, I think there are a few caveats with the _prompt design_ characterization:

1.  Pixel-perfect designs are unimportant for GPT-4, and will probably be obsolete for GPT-4.5 or better models.
2.  The context window constraint may disappear, if one extrapolates the recent trend of long-context models. I am not convinced of this, though.
3.  OpenAI appears to be moving in the direction of offering less and less control over the prompt to developers; it is possible that in a year there will be no such thing as a prompt, with the API call just asking us for the raw inputs plus an instruction. This trend of less control started with the chat format and has continued with the recently announced function calling.
4.  It’s possible that caching is one of the most important aspects of prompting, in which case it starts sounding a bit more like engineering than design.
5.  Perhaps prompt design is too low-level, and should be left to a higher-level framework or compiler (e.g. [langchain](https://github.com/hwchase17/langchain)). I think this may be true, but given the quickly changing nature of the LLMs, I personally prefer to be as close to the raw model as possible.

================
File: inspiration/reliable-ux-durable-obj.md
================
Title: Reliable UX for AI chat with Durable Objects

URL Source: https://sunilpai.dev/posts/reliable-ux-for-ai-chat-with-durable-objects/

Published Time: 2025-01-27T00:00:00.000Z

Markdown Content:
tl;dr - one durable object per chat room, websocket connection to it, and you’re done. no more disconnects or weird architectures.

Folks typically build ai chat systems with serverless offerings from providers (like aws lambda and cloudflare workers). They’re architected as normal request-response systems, with a backing database somewhere. While they “work”, they’re not ideal for a number of reasons:

*   because they try to stick to a request-response model; it means subsequent messages are blocked until the previous one is finished. This is particularly annoying when the streaming response is long, and you have a bunch of messages you want to send anyway.

![Image 1: Blocked input](https://sunilpai.dev/_astro/blocked-input.6NctWzd9_ZNAg5K.webp)

*   maybe you then try to implement a queuing system in yet another service, making your architecture even more complex, and you have to twist and turn your code to make it work.

*   all these serverless things use some form of streaming responses, directly proxied to the LLM provider; this means if you’re in the middle of a long response, and you get disconnected/refresh your browser, you lose your place. this is particularly bad with the rise of reasoning models like openai’s o1, deepseek’s r1, all those. with timeouts and all, the stream breaks eventually even if you’re not disconnected.


![Image 2: Broken stream](https://sunilpai.dev/_astro/broken-stream.Ble2Zyv7_23qkzF.webp)

*   ok so you decide to use your database as the source of truth, somehow piping the responses to it, and then having your frontend read from the db. maybe your db has a subscription type thing. suddenly you’re having to manage race conditions as well. what you thought would be a weekend optimisation is now a full time job.

*   ever think about why multiplayer ai chat systems are so rare? this is why. not even discounting that websockets for true real time chat aren’t really possible with these serverless offerings. you have to deal with message ordering, a reliable broadcast system, all that. (I’ve spoken about length about how this is now going to be thousands in sunk cost)


![Image 3: Complex architecture](https://sunilpai.dev/_astro/complex-architecture.gFj5o0uy_1rVeCK.webp)

honestly I could go on and on. but “serverless” is just a bad fit for realtime/long running/multiplayer systems in general. it’s honestly amazing how far people have come with it at all. just stop faffing around trying to fit a chat sized square peg into a serverless round hole. you can fix all of this today.

durable objects (bad name, amazing tech) solve all of this. literally. durable objects are like tiny javascript vms/containers/computers that you can spin up for an entity, and keep them around for a long time. in this scenario, you’d spin up a durable object for every chat room, and let users (and ai!) connect to it. use websockets to connect to them, and stream messages back and forth. that’s it.

![Image 4: Simple architecture](https://sunilpai.dev/_astro/simple-architecture.Akf3G_u-_1T64fV.webp)

message ordering is guaranteed because it’s just a websocket. you can either hold the entire state of the chat room in memory, and/or use the inbuild database (one per durable object) to store all your messages and stuff. because it’s just syncing state over a websocket, it doesn’t matter whether you reconect/disconnect/refresh your browser. you just get all the state again on reconnection and resume streaming. the actual ai stream will keep piping into your persistence whether or not you’re connected. want to do multiplayer? connect with another websocket, done. no race conditions, your state and compute are running on a single thread in the durable object. want to do server side rendering? first use an http request to render the html from inside the durable object, and then continue streaming when a websocket connects. done. these objects will go to sleep when non one’s connected. and spin back up with zero cold start time when you come back.

stop faffing. use this tech, ship your thing.

*   an entire chat backend build with durable objects/websockets/persistence in 150 loc: [https://github.com/threepointone/durable-chat/blob/main/src/server/index.ts](https://github.com/threepointone/durable-chat/blob/main/src/server/index.ts)
*   durable objects are computers [https://sunilpai.dev/posts/durable-objects-are-computers/](https://sunilpai.dev/posts/durable-objects-are-computers/)
*   the cloudflare stack for ai apps [https://sunilpai.dev/posts/cloudflare-workers-for-ai-agents/](https://sunilpai.dev/posts/cloudflare-workers-for-ai-agents/)

ship today. sleep tomorrow.

================
File: inspiration/task-tracking.md
================
Title: let's talk about a task tracking system for ai agents

URL Source: https://sunilpai.dev/posts/ai-agents-need-tracking/

Published Time: 2025-01-24T00:00:00.000Z

Markdown Content:
24 January 2025

AI agents need tracking software, and we need to build it.

(tl;dr premise: ai agents do tasks. therefore ai agents need a task tracking system. this is probably what a “framework” for ai agents should be.)

![Image 1: task tracker](https://sunilpai.dev/_astro/task-tracker.2akAwx6O_29kTjP.webp)

think of it as the same vibe you get from tools like jira or linear, but tailored to a bunch of bots that can actually do the work. the real magic is in how it bundles transparency, collaboration, and continuous learning all in one place. first off, you get to see exactly which agent is doing what and why, because every action is logged like a paper trail—no more guesswork about hidden processes. second, you can shift tasks around super easily if an agent gets stuck or if you need a human to intervene, so you don’t lose momentum when you hit an unexpected snag. third, the system creates a sort of knowledge library by storing completed tasks, meaning agents (and humans) can reference past solutions, drastically reducing repetitive labor or duplicating efforts. finally, you can keep an eye on budget constraints like token usage or gpu hours, scaling up or paring down your workforce of agents as needed without ripping your hair out over resource management. so basically, it’s a synergy of human-like pm rigor and ai autonomy, solving a ton of headaches in one tidy package. let’s dig in:

why do we even need this rn?
----------------------------

*   in normal human pm setups, you chop a project into tasks.
*   each task has a success criteria, you track it, then mark it done.
*   we can do the same for ai bc it’s basically just automating that same flow.

core pieces of the puzzle
-------------------------

1.  **supervisor agent**

*   basically the “pm agent” that divides the big objective into smaller tasks, manages them, and keeps an eye on deadlines or goals.

2.  **specialized agents**

*   each agent is good at some niche, so you throw tasks at them that match their skillset. they log all their steps so we can see what’s going on.

3.  **task repo**

*   every completed task gets stored here, with logs and everything. if there’s a future problem that looks similar, guess what? we can rummage through old tasks to see how we solved it.

4.  **budget & resources**

*   if you only have a small budget of tokens, you keep it lean. if you have a big bucket of cpu/gpu time, spin up more agents or let them do deeper research.

step-by-step flow
-----------------

### step 1: define the big idea

someone (maybe a human, maybe an agent) says, “hey, i want to create a new project.” they specify the end goal.

### step 2: break it down

the supervisor agent slices the project into sub-tasks. each sub-task has:

*   a description
*   success criteria
*   dependencies

Main Project Goal (e.g., Build a Website) ↓ Sub Task 1 ↓ Sub Task 2 ↓ Sub Task 3

### step 3: assign tasks

the supervisor agent delegates tasks to whichever specialized agent can handle them (or to a human if needed). tasks get queued by priority or dependencies.

### step 4: do the thing

agents tackle the tasks. each action—function calls, data lookups, etc.—goes into the log. if an agent can’t finish bc it hits some skill/capacity wall, it reassigns or flags it for a human. (this also gives a convenient ui for “human in the loop”)

### step 5: wrap it up

once the success criteria are met, that sub-task is considered done. if a human isn’t happy with the result, they can reopen the task with notes. rinse and repeat.

### step 6: knowledge stash

closed tasks live in a repository. new tasks can rummage through old solutions. honestly, that’s half the point—less re-inventing the wheel each time.

budgeting & resource usage
--------------------------

*   define how many tokens or how much cpu/gpu you can burn.
*   if you’re flush, spin up a ton of agents for deeper exploration.
*   if you’re broke, keep it minimal and run tasks in a more straightforward manner.

observability & logs
--------------------

some folks think monitoring means cpu usage or memory usage. here, we shift to a **task-centric** vantage:

1.  you see real sub-task status updates instead of random system metrics.
2.  you can do classic burn-down charts to see how many tasks are left.
3.  everything’s logged for accountability (or just for debugging).

final thoughts
--------------

this approach merges normal pm logic with ai autonomy. you can keep a handle on progress, plus you get that sweet knowledge repo from past tasks. if you ever want to scale up or pivot fast, you have an infrastructure that’s basically standard pm but for bots.

anyway, that’s the pitch.

================
File: memory/bank_00.md
================
# Memory Bank 00 - Agent Framework Infrastructure

## Implementation Progress

- [x] **Core Agent Infrastructure**
  - [x] Defined `Agent` interface in `@tools/core/agent.ts`
  - [x] Implemented `Tool` interface and helper functions in `@tools/core/tool.ts`
  - [x] Created LLM provider interfaces in `@tools/providers/llm.ts`
  - [x] Implemented OpenRouter provider with Vercel AI SDK in `@tools/providers/openrouter.ts`
  - [x] Defined Memory system interfaces in `@tools/memory/types.ts`
  - [x] Created agent factory in `@tools/core/factory.ts`
  - [x] Implemented tool registry in `@tools/core/registry.ts`

- [x] **Mastra Workflow Engine**
  - [x] Defined workflow interfaces in `@tools/mastra/types.ts`
  - [x] Implemented workflow creation and management in `@tools/mastra/workflow.ts`
  - [x] Created workflow context handling in `@tools/mastra/context.ts` (defined in codebase)
  - [x] Implemented memory integration for workflows in `@tools/mastra/memory.ts` (defined in codebase)
  - [x] Added workflow visualization utilities in `@tools/mastra/visualization.ts` (defined in codebase)
  - [x] Created predefined workflows in `@tools/mastra/workflows/index.ts`
  - [x] Implemented utility functions in `@tools/mastra/utils.ts` (defined in codebase)

- [x] **Memory System**
  - [x] Defined memory interfaces in `@tools/memory/types.ts`
  - [x] Implemented memory provider interfaces in `@tools/memory/providers/types.ts`
  - [x] Created in-memory provider in `@tools/memory/providers/in-memory.ts`
  - [x] Implemented memory factory in `@tools/memory/factory.ts`

## Current Status

The Next-Agent framework is taking shape with a strong foundation built around:

1. **TypeScript-First Design**: All components have comprehensive TypeScript interfaces for type safety
2. **Workflow-Based Agent Architecture**: Using Mastra for structured, stateful workflows
3. **Provider Abstraction**: LLM interactions are abstracted through provider interfaces
4. **Memory Management**: Sophisticated memory system with short-term and long-term storage
5. **Tool Integration**: Standardized tool interfaces for consistent agent capabilities
6. **Factory Pattern**: Easy creation of agents, memory systems, and tools

## Next Steps

1. **Implement More Memory Providers**
   - [x] Create in-memory provider for development
   - [ ] Add Redis provider for production use
   - [ ] Implement Pinecone vector store provider
   - [ ] Add DynamoDB provider option

2. **Agent Factory and Registration**
   - [x] Create agent factory for easy agent instantiation
   - [ ] Implement agent registry for discovering available agents
   - [x] Add agent state serialization and persistence
   - [ ] Create agent configuration schema and validation

3. **Tool Registry and Standard Tools**
   - [x] Implement tool registry for tool discovery
   - [ ] Create standard tool collection (search, fetch, math, etc.)
   - [ ] Add tool validation and documentation generation
   - [ ] Implement tool testing utilities

4. **LLM Provider Implementations**
   - [x] Implement OpenRouter provider
   - [ ] Add OpenAI provider
   - [ ] Create Anthropic provider
   - [ ] Implement Google AI (Gemini) provider

5. **CLI Integration for Next.js**
   - [ ] Create scaffolding CLI commands
   - [ ] Add agent generation templates
   - [ ] Implement workflow generation utilities
   - [ ] Create integration helpers for Next.js projects

## Technical Notes

- The framework is designed with a clear separation of concerns:
  - Core interfaces and types
  - Workflow management
  - Memory systems
  - Tool integration
  - LLM provider abstraction

- Mastra provides a structured approach to workflow-based agents with:
  - Explicit step definitions
  - Dependency management between steps
  - Context sharing across workflow
  - Visualization capabilities
  - Error handling and retry mechanisms

- The memory system allows for sophisticated state management with:
  - Short-term memory for current execution
  - Long-term memory for persistence across sessions
  - Vector storage for semantic search
  - Document and key-value stores for structured data

## Relation to PAM (Pleasure Access Module)

While the PAM will be built using this framework, the current focus is on establishing the core agent framework that can be used for any type of agent application. PAM will serve as the first proof-of-concept implementation, demonstrating how the framework can be applied to a specific domain.

The separation between the framework and its applications ensures:
1. Reusability across different projects
2. Cleaner architecture with proper separation of concerns
3. Better testability of core components
4. Easier maintenance and extension

## References

- Mastra is inspired by TypeScript-first workflow engines
- Memory system draws inspiration from vector database patterns
- Tool registry is influenced by OpenAI's function calling API
- Workflow visualization leverages Mermaid.js diagram capabilities

================
File: memory/bank_10.md
================
# Next-Agent Framework Memory Bank 10

## Project Renaming and Direction

We've renamed the core framework from `@tools` to `@next-agent` to better reflect the purpose of the project: a Vercel-native agent generation framework for Next.js applications. This change aligns the directory structure with our vision of creating a dedicated CLI tool that can be run as `pnpm next-agent` to generate contextually-aware AI agents for any Next.js application.

## Current Implementation Status

- [x] **Core Agent Infrastructure**
  - [x] Defined `Agent` interface with execution capabilities
  - [x] Created `Tool` interface for standardized tool integration
  - [x] Implemented `ToolRegistry` for tool discovery and management
  - [x] Developed `AgentFactory` for simplified agent creation
  - [x] Built OpenRouter integration with Vercel AI SDK

- [x] **Memory System**
  - [x] Designed `Memory` interface with short-term and long-term storage
  - [x] Implemented `InMemoryProvider` for development/testing
  - [x] Created `MemoryFactory` for configurable memory systems
  - [x] Added persistence capabilities to maintain context across sessions

- [x] **Mastra Workflow Engine**
  - [x] Developed a TypeScript-first workflow system
  - [x] Created workflow visualization capabilities
  - [x] Implemented error handling and retry mechanisms
  - [x] Designed predefined workflows for common agent tasks
  - [x] Added workflow state management for tracking execution

## Next Steps

1. **CLI Tool Development**
   - [ ] Create a CLI command structure for `next-agent`
   - [ ] Implement project scanning to understand codebase context
   - [ ] Design a configuration system for customizing generated agents
   - [ ] Add interactive prompts for agent generation options

2. **Vercel Integration**
   - [ ] Implement Upstash KV integration for persistent storage
   - [ ] Add Neon PostgreSQL support for structured data
   - [ ] Create Vercel Blob storage integration for assets
   - [ ] Design deployment helpers for serverless functions

3. **Agent Generation System**
   - [ ] Develop a template system for code generation
   - [ ] Create prompting pipelines that bundle codebase context
   - [ ] Implement web content fetching via r.jina.ai
   - [ ] Add intelligent suggestion system for agent capabilities

4. **Documentation and Examples**
   - [ ] Create comprehensive documentation for the framework
   - [ ] Design example agents for common use cases
   - [ ] Build tutorials for custom agent development
   - [ ] Develop a showcase of real-world applications

## Project Vision

The next-agent framework is designed to be the easiest way to add AI capabilities to any Next.js application. By leveraging the full Vercel ecosystem (Upstash, Neon, Blob storage) and integrating with OpenRouter for flexible LLM access, we're creating a tool that requires minimal setup - users only need an OpenRouter API key to get started.

The key innovations of our approach include:

1. **Contextual Awareness**: Using repomix to analyze the user's codebase and tailor agents to their specific project
2. **Web Content Enhancement**: Leveraging r.jina.ai to pull in relevant information from external sources
3. **Vercel Native**: Seamless integration with all Vercel infrastructure for production-ready deployment
4. **Workflow-Based Architecture**: Using the Mastra engine for sophisticated, stateful agent behaviors

By providing a comprehensive CLI tool that handles everything from agent generation to deployment, we significantly lower the barrier to entry for adding AI capabilities to Next.js applications.

## Technical Approach

Our technical approach emphasizes:

1. **TypeScript-First Design**: Comprehensive type safety throughout the codebase
2. **Modular Architecture**: Clean separation of concerns between core components
3. **Factory Patterns**: Simple creation of complex objects with sensible defaults
4. **Extensibility**: Easy to customize and extend for specific use cases
5. **Native Integration**: Prioritizing Vercel and Next.js native technologies

The goal is to provide an agent generation tool that feels like a natural extension of the Next.js ecosystem, while offering powerful customization for more advanced users.

================
File: memory/bank_11.md
================
# Retube-X Project Memory Bank 11: Next-Agent Framework Progress

## Implementation Progress

- [x] Fixed Next-Agent package for use as a CLI tool
  - [x] Updated chalk dependency to use CommonJS compatible version (4.x)
  - [x] Created proper root index.ts file to export core components 
  - [x] Eliminated dependencies on Vercel AI SDK in OpenRouter provider
  - [x] Implemented standalone streaming solution for OpenRouter

## Current Status

The Next-Agent framework is now working as a CLI tool that can be installed via `npx next-agent@latest`. We've made significant progress on the framework to ensure it works consistently across different environments.

### What Works
- Basic CLI infrastructure is in place
- Package can be installed and run with the `next-agent` command
- Core infrastructure is properly organized
- Standalone OpenRouter integration without Vercel SDK dependencies

### Current Limitations
- Some TypeScript errors remain in the codebase
- CLI commands need further improvements
- Core components like memory system need fixing

## Next Steps

1. **Finish CLI Commands**
   - [ ] Complete the configure command implementation 
   - [ ] Enhance init command with better project scanning
   - [ ] Add better error handling and user feedback

2. **Improve Memory System**
   - [ ] Fix memory provider interfaces
   - [ ] Implement Upstash KV memory provider
   - [ ] Add memory visualization tools

3. **Complete Mastra Workflow Integration**
   - [ ] Finalize workflow engine for agent orchestration
   - [ ] Create workflow visualization utilities
   - [ ] Add pre-built workflows for common tasks

4. **PAM Integration for Retube-X**
   - [ ] Create Project Analysis Module implementation
   - [ ] Add content scanning capabilities specific to video platforms
   - [ ] Integrate with r.jina.ai for content fetching
   - [ ] Build specialized agent templates for video content analysis

## How This Supports Retube-X PAM

The Next-Agent framework will provide the foundation for Retube-X's Project Analysis Module in several key ways:

1. **Contextual Understanding**: The framework's ability to scan a Next.js project and understand its structure will allow the PAM to comprehend the current state of the Retube-X application, including its components, dependencies, and data models.

2. **Content Analysis**: By integrating with OpenRouter, the PAM will be able to analyze adult video content using non-moderated AI models, extracting attributes like performers, themes, visual styles, and more.

3. **Workflow Orchestration**: The Mastra workflow system will enable complex analysis pipelines for video content, coordinating between content fetching, analysis, classification, and organization into grids.

4. **Memory Management**: The enhanced memory system will allow the PAM to maintain state across analysis sessions, remember user preferences, and build a knowledge base of content attributes over time.

5. **Template Generation**: The agent will be able to generate specialized components for Retube-X, such as grid layouts, content filters, and semantic clustering visualizations.

## Technical Notes

- The module resolution issues with ESM vs. CommonJS have been addressed by downgrading chalk to version 4.x
- The OpenRouter provider now uses native web APIs for streaming, eliminating the dependency on Vercel's AI SDK
- The framework is being designed with special consideration for adult content analysis, ensuring it can work with non-moderated AI models

## Vision for PAM in Retube-X

The Project Analysis Module for Retube-X will serve as an AI assistant that helps users discover and organize adult content through semantic understanding rather than traditional categories. By leveraging the Next-Agent framework, PAM will:

1. Analyze video content from various platforms
2. Extract nuanced attributes beyond explicit categories
3. Organize content into semantically meaningful grids
4. Provide personalized recommendations based on user preferences
5. Generate natural language explanations of content collections

This approach will transform how users discover and engage with adult content, moving from keyword-based searches to a rich, attribute-driven exploration that respects the complexity and diversity of human preferences.

================
File: tools/mastra/index.md
================
# Mastra Integration

## Overview

This document outlines how to integrate [Mastra](https://github.com/zackees/mastra) with the agent framework. Mastra is a TypeScript-first AI framework designed for creating complex agent workflows with a focus on explicit APIs and concrete implementations.

## Core Concepts

Mastra provides several key capabilities that complement our agent framework:

1. **Workflow Graph Construction**: Creates explicit, inspectable workflows for agent tasks
2. **Memory Management**: Sophisticated memory systems for maintaining context
3. **RAG Integration**: Built-in support for retrieval-augmented generation
4. **Tool Definition**: Type-safe tool definitions with runtime validation

## Integration Architecture

```mermaid
graph TD
    A[Agent Framework] --> B[Mastra Integration]
    B --> C[Workflow Engine]
    B --> D[Memory System]
    B --> E[RAG System]
    B --> F[Tool Factory]
    
    C --> G[Task Orchestration]
    C --> H[Workflow Visualization]
    
    D --> I[Local Memory]
    D --> J[Persistent Memory]
    
    E --> K[Document Processing]
    E --> L[Vector Store]
    
    F --> M[Type-Safe Tools]
    F --> N[Runtime Validation]
```

## Implementation Strategy

Our agent framework will leverage Mastra in the following ways:

1. **For Workflow Orchestration**: Using Mastra's workflow graph to manage complex task sequences
2. **For Memory Management**: Integrating Mastra's memory systems with our agent memory
3. **For RAG Capabilities**: Leveraging Mastra's document processing and retrieval for knowledge-intensive tasks
4. **For Tool Definition**: Using Mastra's type-safe tool definitions

## Integration Examples

### Basic Agent with Mastra Workflow

```typescript
import { createAgent } from '@acme/agent-framework';
import { createWorkflow, createMemory } from 'mastra';

// Create a Mastra workflow
const petAdoptionWorkflow = createWorkflow({
  name: 'PetAdoptionWorkflow',
  description: 'Guides users through pet adoption process',
  steps: [
    {
      id: 'collect_preferences',
      name: 'Collect User Preferences',
      execute: async (context) => {
        // Implementation
      },
    },
    {
      id: 'search_pets',
      name: 'Search Pets',
      execute: async (context) => {
        // Implementation
      },
    },
    {
      id: 'recommend_pets',
      name: 'Recommend Pets',
      execute: async (context) => {
        // Implementation
      },
    },
  ],
});

// Create a Mastra memory
const petAdoptionMemory = createMemory({
  initialState: {
    userPreferences: {},
    foundPets: [],
    selectedPet: null,
  },
});

// Integrate with our agent framework
const petAdoptionAgent = createAgent({
  name: 'PetAdoptionAgent',
  description: 'Helps users find and adopt pets',
  workflow: petAdoptionWorkflow,
  memory: petAdoptionMemory,
  // Our framework components
  tools: [...],
  promptTemplates: {...},
});
```

### Using Mastra for RAG

```typescript
import { createRetriever, createDocumentProcessor } from 'mastra';
import { createAgent } from '@acme/agent-framework';

// Create a document processor
const petDocumentProcessor = createDocumentProcessor({
  chunkSize: 1000,
  chunkOverlap: 200,
});

// Create a retriever
const petRetriever = createRetriever({
  vectorStore: 'pinecone',
  connectionString: process.env.PINECONE_CONNECTION_STRING,
  collectionName: 'pet_knowledge_base',
});

// Create an agent with RAG capabilities
const petExpertAgent = createAgent({
  name: 'PetExpertAgent',
  description: 'Provides expert knowledge about pets',
  tools: [
    {
      name: 'retrievePetInformation',
      description: 'Retrieves information about pets from a knowledge base',
      execute: async (query) => {
        // Process the query
        const processedQuery = await petDocumentProcessor.processQuery(query);
        
        // Retrieve relevant documents
        const documents = await petRetriever.retrieveDocuments(processedQuery);
        
        return { documents };
      },
    },
  ],
});
```

### Type-Safe Tool Definitions

```typescript
import { createTool } from 'mastra';
import { createAgent } from '@acme/agent-framework';

// Define a type-safe tool with Mastra
const searchPetsTool = createTool({
  name: 'searchPets',
  description: 'Search for pets based on user preferences',
  parameters: {
    animalType: {
      type: 'string',
      description: 'Type of animal (dog, cat, etc.)',
    },
    breed: {
      type: 'string',
      description: 'Breed of the animal',
      required: false,
    },
    age: {
      type: 'number',
      description: 'Maximum age in months',
      required: false,
    },
    location: {
      type: 'string',
      description: 'Location for adoption',
      required: false,
    },
  },
  returns: {
    type: 'object',
    properties: {
      pets: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            breed: { type: 'string' },
            age: { type: 'number' },
            // Other properties
          },
        },
      },
    },
  },
  execute: async (params) => {
    // Implementation
    return { pets: [] };
  },
});

// Use the tool in our agent framework
const petAdoptionAgent = createAgent({
  name: 'PetAdoptionAgent',
  description: 'Helps users find and adopt pets',
  tools: [searchPetsTool],
});
```

## Benefits of Integration

1. **Type Safety**: Mastra provides strong TypeScript typing for all its components
2. **Workflow Visualization**: Mastra workflows can be visualized for debugging and monitoring
3. **Explicit APIs**: Mastra focuses on concrete implementations rather than abstractions
4. **Memory Persistence**: Sophisticated memory systems for maintaining context across sessions
5. **RAG Capabilities**: Built-in support for document processing and retrieval

## Implementation Notes

1. **Memory Integration**: Ensure that Mastra's memory system is synchronized with our agent memory
2. **Workflow Integration**: Use Mastra's workflow graph to orchestrate complex tasks
3. **Tool Compatibility**: Ensure that Mastra's tools are compatible with our tool registry
4. **Event Synchronization**: Synchronize events between Mastra and our event bus

## Next Steps

1. Implement the Mastra adapter for our agent framework
2. Create examples of agents using Mastra workflows
3. Build RAG-enabled agents using Mastra's document processing
4. Develop a tool factory that uses Mastra's type-safe tool definitions

================
File: tools/mastra/memory.md
================
# Mastra Memory System

## Overview

The Mastra memory system provides sophisticated state management for workflow-based agents. This document explains how to implement and use the memory system to maintain context throughout agent workflows.

## Key Concepts

Mastra's memory system is designed with the following principles:

1. **Persistence**: State can be saved and retrieved across sessions
2. **Structured Storage**: Data is organized in a logical, queryable format
3. **Hierarchical Access**: Memory can be scoped to different levels (global, workflow, step)
4. **Typed Interface**: TypeScript typing provides compile-time safety
5. **Extensibility**: Custom memory providers can be implemented

## Memory Architecture

```mermaid
graph TD
    A[Agent Memory] --> B[Short-term Memory]
    A --> C[Long-term Memory]
    
    B --> D[Conversation Context]
    B --> E[Execution State]
    
    C --> F[Vector Store]
    C --> G[Document Store]
    C --> H[Key-Value Store]
    
    I[Memory Manager] --> A
    
    J[Memory Providers] --> K[Local Storage]
    J --> L[Redis]
    J --> M[Firestore]
    J --> N[Custom Provider]
```

## Memory Types

### 1. Short-Term Memory

Short-term memory holds transient information needed for the current execution:

```typescript
interface ShortTermMemory {
  // Conversation context
  messages: Message[];
  addMessage: (message: Message) => void;
  getRecentMessages: (count?: number) => Message[];
  
  // Execution state
  executionState: Record<string, any>;
  setExecutionState: <T>(key: string, value: T) => void;
  getExecutionState: <T>(key: string) => T | undefined;
}
```

### 2. Long-Term Memory

Long-term memory preserves information across sessions:

```typescript
interface LongTermMemory {
  // Vector store for semantic search
  vectorStore: {
    add: (documents: Document[]) => Promise<string[]>;
    search: (query: string, limit?: number) => Promise<Document[]>;
    delete: (ids: string[]) => Promise<void>;
  };
  
  // Document store for structured data
  documentStore: {
    add: <T>(collection: string, document: T) => Promise<string>;
    get: <T>(collection: string, id: string) => Promise<T | null>;
    query: <T>(collection: string, filter: any) => Promise<T[]>;
    update: <T>(collection: string, id: string, update: Partial<T>) => Promise<void>;
    delete: (collection: string, id: string) => Promise<void>;
  };
  
  // Key-value store for simple data
  keyValueStore: {
    set: <T>(key: string, value: T) => Promise<void>;
    get: <T>(key: string) => Promise<T | null>;
    delete: (key: string) => Promise<void>;
  };
}
```

## Memory Context

Memory context provides a unified interface to both short-term and long-term memory:

```typescript
interface MemoryContext {
  // Combined interface
  shortTerm: ShortTermMemory;
  longTerm: LongTermMemory;
  
  // Utility methods
  remember: <T>(key: string, value: T) => Promise<void>;  // Stores in both short and long-term
  recall: <T>(key: string) => Promise<T | undefined>;     // Tries short-term, then long-term
  forget: (key: string) => Promise<void>;                 // Removes from both
  
  // Scoped access
  workflow: (workflowId: string) => MemoryContext;        // Scoped to workflow
  step: (stepId: string) => MemoryContext;                // Scoped to step
}
```

## Memory Configuration

Configure the memory system when creating an agent:

```typescript
import { createAgent, createMemorySystem } from '@acme/agent-framework';

const memorySystem = createMemorySystem({
  providers: {
    shortTerm: {
      type: 'in-memory',
      // Options for in-memory provider
    },
    longTerm: {
      type: 'redis',
      // Redis connection options
      url: process.env.REDIS_URL,
      ttl: 60 * 60 * 24 * 7, // 1 week TTL
    },
    vectorStore: {
      type: 'pinecone',
      // Pinecone connection options
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
      index: 'agent-memory',
    }
  },
  // Default TTL for memory items
  defaultTtl: 60 * 60 * 24, // 1 day
  
  // Memory pruning settings
  pruning: {
    enabled: true,
    maxItems: 1000,
    strategy: 'lru',
  }
});

const agent = createAgent({
  name: 'MemoryAwareAgent',
  memory: memorySystem,
  // Other agent options...
});
```

## Using Memory in Workflows

### Step 1: Access Memory in Workflow Steps

```typescript
const memoryWorkflow = createWorkflow({
  name: 'MemoryDemoWorkflow',
  steps: [
    {
      id: 'store_data',
      name: 'Store Data',
      execute: async (context, agent) => {
        // Store data in memory
        await agent.memory.remember('important_data', {
          timestamp: Date.now(),
          value: 'This is important information'
        });
        
        // Store data specifically for this workflow
        await agent.memory.workflow(context.workflowId).remember(
          'workflow_specific', 
          'Only available in this workflow'
        );
        
        // Store in execution context (short-term only)
        agent.memory.shortTerm.setExecutionState('step_result', 'success');
        
        return { status: 'data_stored' };
      }
    },
    {
      id: 'retrieve_data',
      name: 'Retrieve Data',
      prerequisites: ['store_data'],
      execute: async (context, agent) => {
        // Retrieve from memory
        const importantData = await agent.memory.recall('important_data');
        
        // Retrieve workflow-specific memory
        const workflowData = await agent.memory.workflow(context.workflowId)
          .recall('workflow_specific');
        
        // Retrieve from execution state
        const stepResult = agent.memory.shortTerm.getExecutionState('step_result');
        
        return {
          importantData,
          workflowData,
          stepResult
        };
      }
    }
  ]
});
```

### Step 2: Using Vector Memory for Semantic Search

```typescript
const researchWorkflow = createWorkflow({
  name: 'ResearchWorkflow',
  steps: [
    {
      id: 'collect_information',
      name: 'Collect Information',
      execute: async (context, agent) => {
        const { topic } = context.data;
        
        // Store documents in vector store
        await agent.memory.longTerm.vectorStore.add([
          {
            id: 'doc1',
            content: 'Detailed information about the topic',
            metadata: { topic, source: 'research' }
          },
          {
            id: 'doc2',
            content: 'Additional context about related topics',
            metadata: { topic, source: 'background' }
          }
        ]);
        
        return { status: 'information_collected' };
      }
    },
    {
      id: 'search_knowledge',
      name: 'Search Knowledge',
      prerequisites: ['collect_information'],
      execute: async (context, agent) => {
        const { query } = context.data;
        
        // Search vector store for relevant information
        const results = await agent.memory.longTerm.vectorStore.search(
          query, 
          5 // Limit to 5 results
        );
        
        return { results };
      }
    }
  ]
});
```

### Step 3: Persisting Workflow State

```typescript
const resumableWorkflow = createWorkflow({
  name: 'ResumableWorkflow',
  steps: [
    {
      id: 'start_long_process',
      name: 'Start Long Process',
      execute: async (context, agent) => {
        // Start a long-running process
        const processId = 'process_' + Date.now();
        
        // Store the process state
        await agent.memory.workflow(context.workflowId).remember('process', {
          id: processId,
          startTime: Date.now(),
          status: 'running'
        });
        
        // Save workflow state
        await context.save();
        
        return { processId };
      }
    },
    {
      id: 'check_process',
      name: 'Check Process Status',
      prerequisites: ['start_long_process'],
      execute: async (context, agent) => {
        // Retrieve process info
        const process = await agent.memory.workflow(context.workflowId)
          .recall('process');
        
        if (!process) {
          throw new Error('Process information not found');
        }
        
        // Check status (simulated)
        const isComplete = Date.now() - process.startTime > 60000; // 1 minute
        
        if (!isComplete) {
          // Update process status
          await agent.memory.workflow(context.workflowId).remember('process', {
            ...process,
            lastChecked: Date.now()
          });
          
          // Save state and exit with incomplete status
          await context.save();
          return { status: 'in_progress', retry: true };
        }
        
        // Process complete
        await agent.memory.workflow(context.workflowId).remember('process', {
          ...process,
          status: 'complete',
          completionTime: Date.now()
        });
        
        return { status: 'complete' };
      }
    }
  ]
});
```

## Memory Persistence

### Saving Memory State

```typescript
// Save entire memory state
await agent.memory.save();

// Save specific workflow memory
await agent.memory.workflow('workflow-123').save();
```

### Loading Memory State

```typescript
// Load agent memory state
await agent.memory.load('agent-memory-123');

// Load specific workflow memory
await agent.memory.workflow('workflow-123').load();
```

## Memory Providers

Mastra supports multiple memory providers:

### 1. In-Memory Provider

```typescript
const inMemoryProvider = createMemoryProvider({
  type: 'in-memory',
  options: {
    maxItems: 10000,
  }
});
```

### 2. LocalStorage Provider (Browser)

```typescript
const localStorageProvider = createMemoryProvider({
  type: 'local-storage',
  options: {
    prefix: 'agent-memory-',
  }
});
```

### 3. Redis Provider

```typescript
const redisProvider = createMemoryProvider({
  type: 'redis',
  options: {
    url: process.env.REDIS_URL,
    prefix: 'agent-memory:',
    ttl: 60 * 60 * 24, // 1 day
  }
});
```

### 4. Firestore Provider

```typescript
const firestoreProvider = createMemoryProvider({
  type: 'firestore',
  options: {
    collection: 'agent-memory',
    // Firestore config
  }
});
```

### 5. Custom Provider

```typescript
import { MemoryProvider } from '@acme/agent-framework/tools/mastra';

class CustomMemoryProvider implements MemoryProvider {
  async get<T>(key: string): Promise<T | null> {
    // Implementation
  }
  
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    // Implementation
  }
  
  async delete(key: string): Promise<void> {
    // Implementation
  }
  
  async keys(pattern?: string): Promise<string[]> {
    // Implementation
  }
}

const customProvider = new CustomMemoryProvider();
```

## Memory Security Considerations

1. **Encryption**: Sensitive memory can be encrypted before storage
2. **Permissions**: Access control for different memory scopes
3. **Expiration**: TTL settings to automatically expire sensitive data
4. **Isolation**: Separation of memory between agents and workflows
5. **Audit**: Logging of memory access and modifications

## Example: Retube-X User Preferences Memory

```typescript
import { createAgent, createMemorySystem } from '@acme/agent-framework';

// Create memory system
const memorySystem = createMemorySystem({
  providers: {
    shortTerm: { type: 'in-memory' },
    longTerm: { type: 'redis', url: process.env.REDIS_URL },
    vectorStore: { type: 'pinecone', index: 'user-preferences' }
  }
});

// Create user preferences agent
const preferencesAgent = createAgent({
  name: 'UserPreferencesAgent',
  memory: memorySystem,
  workflow: createWorkflow({
    name: 'UserPreferencesWorkflow',
    steps: [
      {
        id: 'collect_preferences',
        execute: async (context, agent) => {
          const { userId, preferences } = context.data;
          
          // Store user preferences
          await agent.memory.longTerm.documentStore.add(
            'user_preferences',
            {
              userId,
              preferences,
              lastUpdated: Date.now()
            }
          );
          
          // Store as vectors for recommendation
          const preferenceVectors = preferences.map(pref => ({
            id: `${userId}_${pref.id}`,
            content: pref.description,
            metadata: {
              userId,
              preferenceId: pref.id,
              category: pref.category,
              weight: pref.weight
            }
          }));
          
          await agent.memory.longTerm.vectorStore.add(preferenceVectors);
          
          return { status: 'preferences_stored' };
        }
      },
      {
        id: 'recommend_content',
        execute: async (context, agent) => {
          const { userId, query } = context.data;
          
          // Retrieve user preferences
          const userPrefs = await agent.memory.longTerm.documentStore.query(
            'user_preferences',
            { userId }
          );
          
          // Search for relevant content based on preferences
          const enhancedQuery = `${query} ${userPrefs[0]?.preferences
            .filter(p => p.weight > 0.7)
            .map(p => p.description)
            .join(' ')}`;
          
          const recommendations = await agent.memory.longTerm.vectorStore.search(
            enhancedQuery,
            10
          );
          
          return { recommendations };
        }
      }
    ]
  })
});
```

## Conclusion

Mastra's memory system provides a robust foundation for building stateful, persistent agents. By leveraging different memory types and scopes, agents can maintain context across interactions and sessions, leading to more intelligent and contextual responses.

For implementation details, refer to the [Memory API Reference](./memory-api.md) document.

================
File: tools/mastra/workflow.md
================
# Workflow-Based Agents with Mastra

## Overview

This document explains how to implement workflow-based agents using [Mastra](https://github.com/zackees/mastra) within our agent framework. Mastra provides a TypeScript-first approach to creating complex agent workflows with explicit APIs, concrete implementations, and sophisticated memory management.

## Key Concepts

Workflow-based agents separate complex tasks into a series of well-defined steps that can be:

1. **Explicitly defined**: Each step has clear inputs, outputs, and success criteria
2. **Independently executed**: Steps can run sequentially, in parallel, or conditionally
3. **Visually representable**: Workflows can be visualized as graphs for better understanding
4. **Statefully tracked**: The current state of execution is always known and can be persisted
5. **Dynamically reconfigurable**: Workflows can adapt based on intermediate results

## Mastra Integration

Our agent framework integrates with Mastra through a dedicated adapter that enables:

```typescript
import { createWorkflow, WorkflowStep } from '@acme/agent-framework/tools/mastra';

// Define a workflow
const petAdoptionWorkflow = createWorkflow({
  name: 'PetAdoptionWorkflow',
  description: 'Guides users through the pet adoption process',
  steps: [
    {
      id: 'collect_preferences',
      name: 'Collect User Preferences',
      execute: async (context) => {
        // Implementation
        return { preferences: { /* user preferences */ } };
      },
    },
    // More steps...
  ],
});
```

## Workflow Definition

A workflow consists of:

1. **Metadata**: Name, description, and other identifying information
2. **Steps**: The individual tasks that make up the workflow
3. **Transitions**: Rules for moving between steps
4. **Context**: Shared data that persists throughout the workflow

### Defining Steps

Each step in a workflow requires:

```typescript
type WorkflowStep = {
  id: string;                            // Unique identifier
  name: string;                          // Human-readable name
  description?: string;                  // Optional description
  prerequisites?: string[];              // Steps that must complete before this one
  execute: (context: WorkflowContext, agent: Agent) => Promise<any>;  // Implementation
  onError?: (error: Error, context: WorkflowContext) => Promise<void>;  // Error handler
  retryConfig?: {                        // Retry configuration
    maxRetries: number;
    backoffFactor: number;
  };
};
```

### Workflow Context

The workflow context provides shared state across steps:

```typescript
interface WorkflowContext {
  // Data storage
  data: Record<string, any>;
  
  // Helper methods
  get: <T>(key: string) => T | undefined;
  set: <T>(key: string, value: T) => void;
  has: (key: string) => boolean;
  delete: (key: string) => void;
  
  // Workflow state
  currentStep: string;
  history: StepExecution[];
  
  // Save/load functionality
  save: () => Promise<void>;
  load: (id: string) => Promise<void>;
}
```

## Workflow Patterns

### Sequential Workflow

Steps execute in a predetermined order:

```typescript
const sequentialWorkflow = createWorkflow({
  name: 'SequentialWorkflow',
  steps: [
    { id: 'step1', /* ... */ },
    { id: 'step2', prerequisites: ['step1'], /* ... */ },
    { id: 'step3', prerequisites: ['step2'], /* ... */ },
  ],
});
```

### Parallel Workflow

Steps execute concurrently:

```typescript
const parallelWorkflow = createWorkflow({
  name: 'ParallelWorkflow',
  steps: [
    { id: 'setup', /* ... */ },
    { id: 'task1', prerequisites: ['setup'], /* ... */ },
    { id: 'task2', prerequisites: ['setup'], /* ... */ },
    { id: 'task3', prerequisites: ['setup'], /* ... */ },
    { id: 'finalize', prerequisites: ['task1', 'task2', 'task3'], /* ... */ },
  ],
});
```

### Conditional Workflow

Execution path depends on conditions:

```typescript
const conditionalWorkflow = createWorkflow({
  name: 'ConditionalWorkflow',
  steps: [
    { 
      id: 'evaluate',
      execute: async (context) => {
        // Decide which path to take
        return { path: Math.random() > 0.5 ? 'pathA' : 'pathB' };
      }
    },
    { 
      id: 'pathA',
      prerequisites: ['evaluate'],
      execute: async (context) => {
        const { path } = context.get('evaluate');
        if (path !== 'pathA') return { skip: true };
        // Path A implementation
      }
    },
    { 
      id: 'pathB',
      prerequisites: ['evaluate'],
      execute: async (context) => {
        const { path } = context.get('evaluate');
        if (path !== 'pathB') return { skip: true };
        // Path B implementation
      }
    },
  ],
});
```

## Implementing a Workflow-Based Agent

### Step 1: Define the Workflow

```typescript
// Define the workflow steps and structure
const contentAnalysisWorkflow = createWorkflow({
  name: 'ContentAnalysisWorkflow',
  description: 'Analyzes content and generates a semantic grid',
  steps: [
    {
      id: 'planning',
      name: 'Planning Analysis Approach',
      execute: async (context, agent) => {
        const { input } = context.data;
        
        // Use LLM to plan the approach
        const plan = await agent.llm.generate({
          prompt: `Plan how to analyze this content: ${input}`,
          temperature: 0.7
        });
        
        context.set('plan', plan);
        return { plan };
      }
    },
    {
      id: 'search',
      name: 'Searching for Content',
      prerequisites: ['planning'],
      execute: async (context, agent) => {
        const { input, plan } = context.data;
        
        // Search for relevant content
        const searchResults = await agent.tools.execute('searchContent', {
          query: input,
          plan: plan
        });
        
        context.set('searchResults', searchResults);
        return { searchResults };
      }
    },
    // Additional steps...
  ]
});
```

### Step 2: Create the Agent with the Workflow

```typescript
import { createAgent } from '@acme/agent-framework';
import { contentAnalysisWorkflow } from './workflows/content-analysis';

const contentAnalysisAgent = createAgent({
  name: 'ContentAnalysisAgent',
  description: 'Analyzes content and generates semantic clustering',
  workflow: contentAnalysisWorkflow,
  tools: [
    // Agent tools...
  ],
  memory: {
    // Memory configuration...
  }
});
```

### Step 3: Execute the Workflow

```typescript
// Execute the entire workflow
const result = await contentAnalysisAgent.executeWorkflow({
  input: userInput,
  additionalContext: { /* any additional data */ }
});

// Or execute a specific step
const planningResult = await contentAnalysisAgent.executeWorkflowStep('planning', {
  input: userInput
});
```

## Workflow Visualization

Mastra workflows can be visualized for better understanding:

```typescript
import { visualizeWorkflow } from '@acme/agent-framework/tools/mastra';

// Generate a mermaid diagram of the workflow
const diagram = visualizeWorkflow(contentAnalysisWorkflow);
console.log(diagram);
```

This generates a mermaid.js diagram like:

```mermaid
graph TD
    A[Planning] --> B[Search]
    B --> C[Analysis]
    C --> D[Generation]
    
    classDef completed fill:#8f8,stroke:#484,stroke-width:2px;
    classDef current fill:#fd8,stroke:#b90,stroke-width:2px;
    
    class A completed;
    class B current;
```

## Error Handling

Mastra provides robust error handling capabilities:

```typescript
const robustWorkflow = createWorkflow({
  name: 'RobustWorkflow',
  steps: [
    {
      id: 'risky_step',
      execute: async (context) => {
        // Implementation that might fail
      },
      onError: async (error, context) => {
        // Log error and take recovery action
        context.set('error', error.message);
        context.set('recovery', 'attempting alternative approach');
        
        // Return fallback result
        return { status: 'recovered', fallbackData: { /* ... */ } };
      },
      retryConfig: {
        maxRetries: 3,
        backoffFactor: 2 // Exponential backoff
      }
    }
  ]
});
```

## Persisting Workflow State

Workflows can save their state for later resumption:

```typescript
// Save workflow state
await workflow.save();

// Resume from saved state
await workflow.load('workflow-instance-id');
```

## Integrating with NextJS

### 1. API Route for Workflow Execution

```typescript
// app/api/workflow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getWorkflowManager } from '@acme/agent-framework/tools/mastra';

export async function POST(request: NextRequest) {
  const { workflowName, input, stepId } = await request.json();
  
  try {
    const workflowManager = getWorkflowManager();
    const workflow = workflowManager.getWorkflow(workflowName);
    
    if (!workflow) {
      return NextResponse.json(
        { error: `Workflow ${workflowName} not found` },
        { status: 404 }
      );
    }
    
    if (stepId) {
      // Execute a specific step
      const result = await workflow.executeStep(stepId, { input });
      return NextResponse.json({ result });
    } else {
      // Execute the entire workflow
      const result = await workflow.execute({ input });
      return NextResponse.json({ result });
    }
  } catch (error) {
    console.error('Workflow execution error:', error);
    return NextResponse.json(
      { error: 'Workflow execution failed' },
      { status: 500 }
    );
  }
}
```

### 2. Server Component for Workflow Status

```typescript
// app/workflows/[id]/page.tsx
import { WorkflowStatus } from '@/components/workflow-status';

export default async function WorkflowPage({ params }: { params: { id: string } }) {
  const { getWorkflowManager } = await import('@acme/agent-framework/tools/mastra');
  const workflowManager = getWorkflowManager();
  
  const workflow = await workflowManager.loadWorkflow(params.id);
  
  if (!workflow) {
    return <div>Workflow not found</div>;
  }
  
  return (
    <div>
      <h1>Workflow: {workflow.name}</h1>
      <WorkflowStatus workflow={workflow} />
    </div>
  );
}
```

## Example: Retube-X Content Analysis Workflow

Here's a complete example of a workflow that could be used in Retube-X for content analysis:

```typescript
import { createWorkflow } from '@acme/agent-framework/tools/mastra';

export const videoAnalysisWorkflow = createWorkflow({
  name: 'VideoAnalysisWorkflow',
  description: 'Analyzes video content and creates semantic clusters',
  steps: [
    {
      id: 'planning',
      name: 'Planning Analysis',
      execute: async (context, agent) => {
        const { input, inputType } = context.data;
        
        const planResult = await agent.tools.execute('planApproach', {
          input,
          inputType
        });
        
        context.set('plan', planResult.plan);
        return planResult;
      }
    },
    {
      id: 'searching',
      name: 'Searching Content',
      prerequisites: ['planning'],
      execute: async (context, agent) => {
        const { input, inputType, plan } = context.data;
        
        const searchResult = await agent.tools.execute('searchContent', {
          input,
          inputType,
          plan
        });
        
        context.set('searchResults', searchResult.results);
        return searchResult;
      }
    },
    {
      id: 'analyzing',
      name: 'Analyzing Content',
      prerequisites: ['searching'],
      execute: async (context, agent) => {
        const { searchResults } = context.data;
        
        const analysisResult = await agent.tools.execute('analyzeContent', {
          content: searchResults
        });
        
        context.set('analysis', analysisResult.analysis);
        return analysisResult;
      }
    },
    {
      id: 'generating',
      name: 'Generating Grid',
      prerequisites: ['analyzing'],
      execute: async (context, agent) => {
        const { analysis } = context.data;
        
        const gridResult = await agent.tools.execute('generateGrid', {
          analysis
        });
        
        context.set('grid', gridResult.grid);
        return gridResult;
      }
    }
  ]
});
```

## Conclusion

Mastra workflow-based agents provide a powerful, structured approach to complex agent tasks. By breaking down processes into explicit steps with clear interfaces, you gain:

1. **Improved reusability**: Steps can be shared across different workflows
2. **Better observability**: The state of execution is clear at every point
3. **Enhanced reliability**: Error handling and retry mechanisms are built in
4. **Simplified maintenance**: Each step can be tested and updated independently
5. **Greater flexibility**: Workflows can be dynamically composed and reconfigured

For more details on specific Mastra capabilities, see the [Mastra Feature Guide](./features.md).

================
File: tools/priompt/index.md
================
Title: GitHub - anysphere/priompt: Prompt design using JSX.

URL Source: https://github.com/anysphere/priompt

Markdown Content:
Priompt
-------

[](https://github.com/anysphere/priompt#priompt)

Priompt (_priority + prompt_) is a JSX-based prompting library. It uses priorities to decide what to include in the context window.

Priompt is an attempt at a _prompt design_ library, inspired by web design libraries like React. Read more about the motivation [here](https://arvid.xyz/prompt-design).

Installation
------------

[](https://github.com/anysphere/priompt#installation)

Install from npm:

npm install @anysphere/priompt && npm install -D @anysphere/priompt-preview

or

yarn add @anysphere/priompt && yarn add --dev @anysphere/priompt-preview

or

pnpm add @anysphere/priompt && pnpm add -D @anysphere/priompt-preview

Examples
--------

[](https://github.com/anysphere/priompt#examples)

Read [examples/README.md](https://github.com/anysphere/priompt/blob/main/examples/README.md) to run the examples.

Principles
----------

[](https://github.com/anysphere/priompt#principles)

Prompts are rendered from a JSX component, which can look something like this:

function ExamplePrompt(
  props: PromptProps<{
    name: string,
    message: string,
    history: { case: "user" | "assistant", message: string }\[\],
  }\>
): PromptElement {
  const capitalizedName \= props.name\[0\].toUpperCase() + props.name.slice(1);
  return (
    <\>
      <SystemMessage\>
        The user's name is {capitalizedName}. Please respond to them kindly.
      </SystemMessage\>
      {props.history.map((m, i) \=\> (
        <scope prel\={\-(props.history.length \- i)}\>
          {m.case \=== "user" ? (
            <UserMessage\>{m.message}</UserMessage\>
          ) : (
            <AssistantMessage\>{m.message}</AssistantMessage\>
          )}
        </scope\>
      ))}
      <UserMessage\>{props.message}</UserMessage\>
      <empty tokens\={1000} /\>
    </\>
  );
}

A component is rendered only once. Each child has a priority, where a higher priority means that the child is more important to include in the prompt. If no priority is specified, the child is included if and only if its parent is included. Absolute priorities are specified with `p` and relative ones are specified with `prel`.

In the example above, we always include the system message and the latest user message, and are including as many messages from the history as possible, where later messages are prioritized over earlier messages.

The key promise of the priompt renderer is:

> Let $T$ be the token limit and $\\text{Prompt}(p\_\\text{cutoff})$ be the function that creates a prompt by including all scopes with priority $p\_\\text{scope} \\geq p\_\\text{cutoff}$, and no other. Then, the rendered prompt is $\\text{\\textbf{P}} = \\text{Prompt}(p\_\\text{opt-cutoff})$ where $p\_\\text{opt-cutoff}$ is the minimum value such that $|\\text{Prompt}(p\_\\text{opt-cutoff})| \\leq T$.

The building blocks of a priompt prompt are:

1.  `<scope>`: this allows you to set priorities `p` for absolute or `prel` for relative.
2.  `<first>`: the first child with a sufficiently high priority will be included, and all children below it will not. This is useful for fallbacks for implementing something like "when the result is too long we want to say `(result omitted)`".
3.  `<empty>`: for specifying empty space, useful for reserving tokens for generation.
4.  `<capture>`: capture the output and parse it right within the prompt.
5.  `<isolate>`: isolate a section of the prompt with its own token limit. This is useful for guaranteeing that the start of the prompt will be the same for caching purposes. it would be nice to extend this to allow token limits like `100% - 100`.
6.  `<br/>`: force a token break at a particular location, which is useful for ensuring exact tokenization matches between two parts of a prompt (e.g. when implementing something like speculative edits).
7.  `<config>`: specify a few common configuration properties, such as `stop` token and `maxResponseTokens`, which can make the priompt dump more self-contained and help with evals.

You can create components all you want, just like in React. The builtin components are:

1.  `<UserMessage>`, `<AssistantMessage>` and `<SystemMessage>`: for building message-based prompts.
2.  `<ImageComponent>`: for adding images into the prompt.
3.  `<Tools>`, `<ZTools>`: for specifying tools that the AI can call, either using a JSON schema or a Zod type.

Advanced features
-----------------

[](https://github.com/anysphere/priompt#advanced-features)

1.  `onEject` and `onInclude`: callbacks that can be passed into any scope, which are called when the scope is either excluded or included in the final prompt. This allows you to change your logic depending on if something is too large for the prompt.
2.  Sourcemaps: when setting `shouldBuildSourceMap` to `true`, the renderer computes a map between the actual characters in the prompt and the part of the JSX tree that they came from. This can be useful to figure out where cache misses are coming from in the prompt.
3.  Prepend `DO_NOT_DUMP` to your priompt props key to prevent it from being dumped, which is useful for really big objects.

Future
------

[](https://github.com/anysphere/priompt#future)

A few things that would be cool to add:

1.  A `<max>` block: specify a `limit` on the number of tokens within a scope, but unlike `<isolate>`, include the inner scopes in the global priority calculation.
2.  Performance-optimized rendering of big trees: minimizing time spent tokenizing is part of it, but part of it is also working around JavaScript object allocation, and it is possible that writing the entire rendering engine in Rust, for example, would make it a lot faster.

Caveats
-------

[](https://github.com/anysphere/priompt#caveats)

1.  We've discovered that adding priorities to everything is sort of an anti-pattern. It is possible that priorities are the wrong abstraction. We have found them useful though for including long files in the prompt in a line-by-line way.
2.  The Priompt renderer has no builtin support for creating cacheable prompts. If you overuse priorities, it is easy to make hard-to-cache prompts, which may increase your cost or latency for LLM inference. We are interested in good solutions here, but for now it is up to the prompt designer to think about caching.
    1.  _Update: Priompt sourcemaps help with caching debugging!_
3.  The current version of priompt only supports around 10K scopes reasonably fast (this is enough for most use cases). If you want to include a file in the prompt that is really long (\>10K lines), and you split it line-by-line, you probably want to implement something like "for lines farther than 1000 lines away from the cursor position we have coarser scopes of 10 lines at a time".
4.  For latency-critical prompts you want to monitor the time usage in the priompt preview dashboard. If there are too many scopes you may want to optimize for performance.
5.  The Priompt renderer is not always guaranteed to produce the perfect $p\_\\text{opt-cutoff}$. For example, if a higher-priority child of a `<first>` has more tokens than a lower-priority child, the currently implemented binary search renderer may return a (very slightly) incorrect result.

Contributions
-------------

[](https://github.com/anysphere/priompt#contributions)

Contributions are very welcome! This entire repo is MIT-licensed.

================
File: tools/priompt/usage.md
================
# Using Priompt with the Agent Framework

This document explains how to use the Priompt library for structured prompt design within the agent framework.

## Introduction to Priompt

Priompt is a JSX-based prompting library that uses priorities to decide what to include in the context window. It allows for structured, component-based prompt design, similar to React for web design.

## Basic Concepts

### PromptElement

A `PromptElement` is the basic building block of a Priompt prompt, similar to a React element.

### Scope

A `<scope>` allows you to assign priorities to sections of your prompt, determining what content is included when the context window is filled.

### Message Components

- `<SystemMessage>`: For system instructions
- `<UserMessage>`: For user inputs
- `<AssistantMessage>`: For assistant responses

## Installation

The agent framework includes Priompt as a dependency. You can use it directly from the framework:

```typescript
import { PriomptTemplate } from '@acme/agent-framework/priompt';
```

## Basic Usage

### Creating a Simple Agent Prompt

```typescript
import { defineAgent } from '@acme/agent-framework';
import { SystemMessage, UserMessage } from '@acme/agent-framework/priompt';

export const simpleAgent = defineAgent({
  name: 'SimpleAgent',
  description: 'A simple agent that responds to user queries',
  
  systemPrompt: () => (
    <SystemMessage>
      You are a helpful assistant that provides information about pets.
      Always be friendly and concise in your responses.
    </SystemMessage>
  ),
  
  // Use the prompt in the agent's processing
  processMessage: async (input, context) => {
    const prompt = (
      <>
        <SystemMessage>
          You are a helpful assistant that provides information about pets.
          Always be friendly and concise in your responses.
        </SystemMessage>
        
        <UserMessage>{input.content}</UserMessage>
      </>
    );
    
    // The framework handles rendering the prompt and calling the LLM
    return await context.llm.complete(prompt);
  }
});
```

## Advanced Usage

### Using Priorities with Scopes

```typescript
import { defineAgent } from '@acme/agent-framework';
import { SystemMessage, UserMessage, AssistantMessage } from '@acme/agent-framework/priompt';

export const petAdoptionAgent = defineAgent({
  name: 'PetAdoptionAgent',
  description: 'Helps users find and adopt pets',
  
  processMessage: async (input, context) => {
    const { history } = context;
    
    const prompt = (
      <>
        <scope p={10}>
          <SystemMessage>
            You are a helpful pet adoption assistant. Your goal is to understand
            user preferences and recommend suitable pets for adoption.
            
            Current user preferences:
            - Animal type: {context.memory.animalType || 'Unknown'}
            - Breed preference: {context.memory.breed || 'No preference'}
            - Age preference: {context.memory.age || 'No preference'}
          </SystemMessage>
        </scope>
        
        {/* Messages with decreasing priority based on age */}
        {history.map((message, i) => (
          <scope p={history.length - i}>
            {message.role === 'user' ? (
              <UserMessage>{message.content}</UserMessage>
            ) : (
              <AssistantMessage>{message.content}</AssistantMessage>
            )}
          </scope>
        ))}
        
        {/* Current message always has highest priority after system message */}
        <scope p={9}>
          <UserMessage>{input.content}</UserMessage>
        </scope>
        
        {/* Reserve space for the response */}
        <empty tokens={500} />
      </>
    );
    
    return await context.llm.complete(prompt);
  }
});
```

### Using First for Fallbacks

```typescript
import { defineAgent } from '@acme/agent-framework';
import { SystemMessage, UserMessage, first } from '@acme/agent-framework/priompt';

export const petSearchAgent = defineAgent({
  name: 'PetSearchAgent',
  description: 'Searches for pets based on user criteria',
  
  processMessage: async (input, context) => {
    // Search for pets using a tool
    const pets = await context.tools.execute('searchPets', {
      animalType: context.memory.animalType,
      breed: context.memory.breed,
      age: context.memory.age,
    });
    
    const prompt = (
      <>
        <SystemMessage>
          You are a helpful pet search assistant. Your goal is to recommend
          pets that match the user's criteria.
        </SystemMessage>
        
        <UserMessage>{input.content}</UserMessage>
        
        <first>
          {/* Full pet data if it fits */}
          <scope p={5}>
            <SystemMessage>
              Available pets:
              {pets.map(pet => `
                - Name: ${pet.name}
                - Type: ${pet.type}
                - Breed: ${pet.breed}
                - Age: ${pet.age}
                - Description: ${pet.description}
              `).join('\n')}
            </SystemMessage>
          </scope>
          
          {/* Summary if full data doesn't fit */}
          <scope p={4}>
            <SystemMessage>
              Available pets (summary):
              {pets.map(pet => `
                - Name: ${pet.name} (${pet.type}, ${pet.breed}, ${pet.age})
              `).join('\n')}
            </SystemMessage>
          </scope>
          
          {/* Minimal info if neither fits */}
          <scope p={3}>
            <SystemMessage>
              {pets.length} pets found matching the criteria. Please ask for specific details.
            </SystemMessage>
          </scope>
        </first>
      </>
    );
    
    return await context.llm.complete(prompt);
  }
});
```

## Creating Reusable Prompt Components

### Define a Reusable Component

```typescript
// app/lib/prompts/pet-adoption-prompts.tsx
import { SystemMessage, UserMessage } from '@acme/agent-framework/priompt';

// Define a reusable prompt component for pet recommendations
export function PetRecommendationPrompt({ pets, userPreferences }) {
  return (
    <SystemMessage>
      The user has the following preferences:
      - Animal type: {userPreferences.animalType || 'Any'}
      - Breed preference: {userPreferences.breed || 'Any'}
      - Age preference: {userPreferences.age || 'Any'}
      - Size preference: {userPreferences.size || 'Any'}
      
      Based on these preferences, here are the matching pets:
      {pets.length === 0 ? (
        'No pets found matching these criteria.'
      ) : (
        pets.slice(0, 5).map((pet, i) => `
          Pet ${i + 1}:
          - Name: ${pet.name}
          - Type: ${pet.type}
          - Breed: ${pet.breed}
          - Age: ${pet.age}
          - Size: ${pet.size}
          - Description: ${pet.description}
        `).join('\n')
      )}
      
      Please recommend suitable pets to the user based on their preferences.
      If there are no exact matches, suggest similar pets that might interest them.
    </SystemMessage>
  );
}

// Define a component for adoption process guidance
export function AdoptionProcessPrompt({ pet }) {
  return (
    <SystemMessage>
      The user is interested in adopting ${pet.name}, a ${pet.age} ${pet.breed} ${pet.type}.
      
      Here is the adoption process:
      1. Application: Complete the adoption application form
      2. Review: The shelter reviews the application
      3. Meeting: Schedule a meeting with the pet
      4. Home check: A shelter representative visits the potential home
      5. Adoption fee: Pay the adoption fee of ${pet.adoptionFee}
      6. Finalization: Sign the adoption papers
      
      Please guide the user through this process, answering any questions they might have.
    </SystemMessage>
  );
}
```

### Use Components in Agent Definition

```typescript
// app/lib/agents/pet-adoption-agent.ts
import { defineAgent } from '@acme/agent-framework';
import { SystemMessage, UserMessage } from '@acme/agent-framework/priompt';
import { PetRecommendationPrompt, AdoptionProcessPrompt } from '../prompts/pet-adoption-prompts';

export const petAdoptionAgent = defineAgent({
  name: 'PetAdoptionAgent',
  description: 'Helps users find and adopt pets',
  
  processMessage: async (input, context) => {
    const { memory, state } = context;
    
    // Determine which prompt to use based on agent state
    const prompt = (
      <>
        <SystemMessage>
          You are a helpful pet adoption assistant. Your goal is to help users
          find and adopt pets that match their preferences.
        </SystemMessage>
        
        {state.adoptionFlow === 'recommendation' && (
          <PetRecommendationPrompt 
            pets={memory.recommendedPets || []} 
            userPreferences={memory.userPreferences || {}} 
          />
        )}
        
        {state.adoptionFlow === 'adoption-process' && memory.selectedPet && (
          <AdoptionProcessPrompt pet={memory.selectedPet} />
        )}
        
        <UserMessage>{input.content}</UserMessage>
      </>
    );
    
    return await context.llm.complete(prompt);
  }
});
```

## Handling Token Limits

Priompt helps manage the token limit by allowing you to prioritize content. The framework uses these priorities to trim the prompt to fit within the token limit.

### Using Empty for Response Space

```typescript
<>
  <SystemMessage>
    You are a helpful assistant.
  </SystemMessage>
  
  <UserMessage>{input.content}</UserMessage>
  
  {/* Reserve 1000 tokens for the response */}
  <empty tokens={1000} />
</>
```

### Using Isolate for Isolation

```typescript
<>
  <isolate tokens={2000}>
    <SystemMessage>
      You are a helpful assistant with extensive knowledge about pets.
      This section will always be included in the prompt.
    </SystemMessage>
    
    <UserMessage>
      I need information about dog breeds that are good for apartments.
    </UserMessage>
  </isolate>
  
  {/* This content may be trimmed if needed */}
  <scope p={5}>
    <SystemMessage>
      Additional information about dog breeds:
      [extensive breed information...]
    </SystemMessage>
  </scope>
</>
```

## Debugging Prompts

The agent framework includes tools for debugging prompts:

```typescript
// Preview the rendered prompt
const renderedPrompt = await agentFramework.promptManager.renderPrompt(prompt, {
  tokenLimit: 4000,
  shouldBuildSourceMap: true,
});

console.log('Rendered Prompt:', renderedPrompt.text);
console.log('Token Count:', renderedPrompt.tokenCount);
console.log('Source Map:', renderedPrompt.sourceMap);
```

## Best Practices

1. **Prioritize Critical Information**: Use higher priorities for instructions and recent context.

2. **Create Reusable Components**: Build a library of prompt components for consistency.

3. **Reserve Response Space**: Always reserve tokens for the AI's response using `<empty>`.

4. **Use Fallbacks**: Implement fallbacks for when content doesn't fit.

5. **Test with Different Token Limits**: Verify your prompts work with different token constraints.

6. **Monitor Token Usage**: Track token usage to optimize costs.

================
File: architecture.md
================
# Agent Framework Architecture

## Overview

This document outlines the architecture for a modular, reusable agent framework for NextJS applications. The framework is designed to be domain-agnostic while providing extension points for specialized use cases.

## Core Principles

The agent framework is built on the following core principles:

1. **Modularity**: Components are decoupled and can be used independently.
2. **Stateful Execution**: Agents maintain state across interactions using durable storage.
3. **Addressability**: Each agent instance has a unique identifier and can be addressed directly.
4. **Task-Oriented**: Work is organized into trackable tasks with clear boundaries.
5. **Event-Driven**: Communication happens through events for loose coupling.
6. **Structured Prompting**: Consistent prompting using JSX-based Priompt library.
7. **Observable**: Every agent action is logged and traceable.

## High-Level Architecture

```mermaid
graph TD
    A[Client Application] --> B[Agent Framework]
    B --> C[Agent Core]
    B --> D[Storage Layer]
    B --> E[Event Bus]
    B --> F[Task Tracker]
    B --> G[Prompt Manager]
    
    C --> H[Agent Instance]
    H --> I[State Machine]
    H --> J[Tool Registry]
    H --> K[Memory]
    
    G --> L[Priompt Integration]
    G --> M[Prompt Templates]
    
    E --> N[Internal Events]
    E --> O[External Events]
    
    F --> P[Task Repository]
    F --> Q[Task Scheduler]
```

## System Components

### Agent Core

The foundation of the framework, responsible for:
- Creating and managing agent instances
- Coordinating with other components
- Providing the main developer API

### Storage Layer

A unified interface for various storage backends:
- In-memory storage for development
- Durable object storage for production
- Database adapters for traditional persistence

### Event Bus

Facilitates communication between:
- Agent instances
- Client applications
- External systems

### Task Tracker

Manages task lifecycle:
- Breaking down large tasks into subtasks
- Tracking task progress and dependencies
- Storing completed tasks for future reference

### Prompt Manager

Centralizes prompt creation and management:
- Structured prompting with Priompt
- Template management
- Consistent styling and formatting

## Integration with NextJS

The framework is designed to integrate seamlessly with NextJS applications:

1. **API Routes**: Each agent can be exposed through a NextJS API route
2. **Server Components**: Direct integration with React Server Components
3. **Middleware**: Optional middleware for request processing
4. **Edge Runtime**: Support for running agents at the edge

## Extension Points

The framework provides several extension points:

1. **Custom Tool Definitions**: Define domain-specific tools
2. **Specialized Agents**: Create agents optimized for specific tasks
3. **Custom Prompt Templates**: Define domain-specific prompting strategies
4. **Storage Adapters**: Connect to preferred storage systems
5. **Event Handlers**: Implement custom event processing logic

## Next Steps

This document provides a high-level overview of the agent framework architecture. The following documents provide more detailed specifications:

- [Core Components](./core-components.md) - Detailed specification of core components
- [Integration Guide](./integration-guide.md) - How to integrate the framework into a NextJS application
- [Priompt Usage](./priompt-usage.md) - How to use Priompt for structured prompting
- [Example Implementation](./example-implementation.md) - Example implementation for a puppy adoption service

================
File: core-components.md
================
# Agent Framework Core Components

This document provides detailed specifications for the core components of the agent framework.

## Agent Core

The Agent Core is the central component of the framework, responsible for creating and managing agent instances.

### AgentManager

```typescript
interface AgentManager {
  createAgent(config: AgentConfig): Promise<Agent>;
  getAgent(id: string): Promise<Agent | null>;
  listAgents(): Promise<Agent[]>;
  deleteAgent(id: string): Promise<void>;
}
```

The `AgentManager` is responsible for the lifecycle of agent instances. It allows for creating, retrieving, listing, and deleting agents.

### Agent

```typescript
interface Agent {
  id: string;
  name: string;
  description: string;
  state: AgentState;
  memory: AgentMemory;
  tools: ToolRegistry;
  
  // Core methods
  initialize(): Promise<void>;
  process(input: UserInput): Promise<AgentResponse>;
  executeTask(task: Task): Promise<TaskResult>;
  
  // Lifecycle hooks
  onStart?(): Promise<void>;
  onComplete?(): Promise<void>;
  onError?(error: Error): Promise<void>;
  
  // State management
  save(): Promise<void>;
  load(): Promise<void>;
}
```

The `Agent` interface defines the core functionality of an agent instance. Each agent has a unique identifier, a state machine, memory, and a set of tools.

### AgentState

```typescript
interface AgentState {
  current: string;
  history: StateTransition[];
  data: Record<string, any>;
  
  transition(to: string, reason: string): void;
  getData(key: string): any;
  setData(key: string, value: any): void;
}
```

The `AgentState` manages the agent's state machine, tracking the current state and history of state transitions.

## Storage Layer

The Storage Layer provides a unified interface for different storage backends.

### StorageProvider

```typescript
interface StorageProvider {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  delete(key: string): Promise<void>;
  list(prefix: string): Promise<string[]>;
  exists(key: string): Promise<boolean>;
}
```

The `StorageProvider` interface defines the basic operations for storing and retrieving data.

### StorageProviders

#### MemoryStorageProvider

In-memory storage for development and testing.

#### DurableObjectStorageProvider

Persistent storage using Cloudflare Durable Objects.

#### DatabaseStorageProvider

Storage adapter for SQL/NoSQL databases.

## Event Bus

The Event Bus facilitates communication between components and external systems.

### EventBus

```typescript
interface EventBus {
  publish(event: Event): Promise<void>;
  subscribe(pattern: string, handler: EventHandler): Subscription;
  unsubscribe(subscription: Subscription): void;
}
```

The `EventBus` allows for publishing events and subscribing to event patterns.

### Event

```typescript
interface Event {
  id: string;
  type: string;
  source: string;
  timestamp: number;
  data: Record<string, any>;
}
```

The `Event` interface defines the structure of events in the system.

### EventHandler

```typescript
type EventHandler = (event: Event) => Promise<void>;
```

Event handlers are functions that process events when they are received.

## Task Tracker

The Task Tracker manages the lifecycle of tasks, including creation, assignment, and completion.

### TaskManager

```typescript
interface TaskManager {
  createTask(spec: TaskSpec): Promise<Task>;
  getTask(id: string): Promise<Task | null>;
  listTasks(filter?: TaskFilter): Promise<Task[]>;
  updateTask(id: string, update: TaskUpdate): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}
```

The `TaskManager` provides operations for managing tasks.

### Task

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: number;
  dependencies: string[];
  assignee: string | null;
  created: number;
  updated: number;
  metadata: Record<string, any>;
  
  // Task operations
  start(): Promise<void>;
  complete(result: TaskResult): Promise<void>;
  fail(error: Error): Promise<void>;
  addSubtask(spec: TaskSpec): Promise<Task>;
}
```

The `Task` interface defines the structure and operations for tasks.

### TaskRepository

```typescript
interface TaskRepository {
  save(task: Task): Promise<void>;
  load(id: string): Promise<Task | null>;
  list(filter?: TaskFilter): Promise<Task[]>;
  delete(id: string): Promise<void>;
}
```

The `TaskRepository` provides storage operations for tasks.

## Prompt Manager

The Prompt Manager centralizes prompt creation and management using Priompt.

### PromptManager

```typescript
interface PromptManager {
  createPrompt(template: string | PromptElement, data?: Record<string, any>): Promise<string>;
  registerTemplate(name: string, template: string | PromptElement): void;
  getTemplate(name: string): string | PromptElement | null;
  listTemplates(): string[];
}
```

The `PromptManager` provides operations for creating and managing prompts.

### PromptTemplate

```typescript
type PromptTemplate = (props: any) => PromptElement;
```

Prompt templates are functions that generate Priompt elements based on input properties.

## Tool Registry

The Tool Registry manages the tools available to agent instances.

### ToolRegistry

```typescript
interface ToolRegistry {
  registerTool(tool: Tool): void;
  getTool(name: string): Tool | null;
  listTools(): Tool[];
  hasToolWithCapability(capability: string): boolean;
  execute(name: string, params: Record<string, any>): Promise<ToolResult>;
}
```

The `ToolRegistry` provides operations for registering and executing tools.

### Tool

```typescript
interface Tool {
  name: string;
  description: string;
  parameters: ToolParameter[];
  execute(params: Record<string, any>): Promise<ToolResult>;
  getCapabilities(): string[];
}
```

The `Tool` interface defines the structure and operations for tools.

## Memory

The Memory component manages the agent's long-term memory.

### AgentMemory

```typescript
interface AgentMemory {
  store(key: string, value: any): Promise<void>;
  retrieve(key: string): Promise<any>;
  search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
  forget(key: string): Promise<void>;
}
```

The `AgentMemory` interface defines operations for storing and retrieving information.

### MemoryProvider

```typescript
interface MemoryProvider {
  initialize(): Promise<void>;
  store(agentId: string, key: string, value: any): Promise<void>;
  retrieve(agentId: string, key: string): Promise<any>;
  search(agentId: string, query: string, options?: SearchOptions): Promise<SearchResult[]>;
  delete(agentId: string, key: string): Promise<void>;
}
```

The `MemoryProvider` interface defines the storage operations for agent memory.

================
File: example-implementation.md
================
# Example Implementation: Puppy Adoption Agent

This document provides a complete example implementation of a puppy adoption agent using the agent framework.

## Overview

The Puppy Adoption Agent helps users find and adopt puppies based on their preferences. It guides users through the adoption process, from understanding their preferences to completing the adoption.

## Implementation

### Step 1: Define Agent Tools

Create a file for the agent's tools:

```typescript
// app/lib/agents/puppy-adoption-tools.ts
import { defineTool } from '@acme/agent-framework';
import { prisma } from '@/lib/prisma';

export const searchPuppies = defineTool({
  name: 'searchPuppies',
  description: 'Search for puppies based on user preferences',
  parameters: [
    { name: 'breed', type: 'string', description: 'Breed of the puppy', required: false },
    { name: 'ageMonths', type: 'number', description: 'Maximum age in months', required: false },
    { name: 'size', type: 'string', description: 'Size of the puppy (small, medium, large)', required: false },
    { name: 'goodWithKids', type: 'boolean', description: 'Whether the puppy should be good with kids', required: false },
    { name: 'location', type: 'string', description: 'Location for adoption', required: false },
  ],
  execute: async ({ breed, ageMonths, size, goodWithKids, location }) => {
    // Build database query based on parameters
    const query: any = {
      where: {
        adopted: false,
      },
    };
    
    if (breed) {
      query.where.breed = {
        contains: breed,
        mode: 'insensitive',
      };
    }
    
    if (ageMonths) {
      query.where.ageMonths = {
        lte: ageMonths,
      };
    }
    
    if (size) {
      query.where.size = size;
    }
    
    if (goodWithKids !== undefined) {
      query.where.goodWithKids = goodWithKids;
    }
    
    if (location) {
      query.where.location = {
        contains: location,
        mode: 'insensitive',
      };
    }
    
    // Execute query
    const puppies = await prisma.puppy.findMany({
      ...query,
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return { puppies };
  }
});

export const getPuppyDetails = defineTool({
  name: 'getPuppyDetails',
  description: 'Get detailed information about a specific puppy',
  parameters: [
    { name: 'puppyId', type: 'string', description: 'ID of the puppy' },
  ],
  execute: async ({ puppyId }) => {
    const puppy = await prisma.puppy.findUnique({
      where: { id: puppyId },
      include: {
        shelter: true,
        medicalRecords: true,
        photos: true,
      },
    });
    
    if (!puppy) {
      throw new Error(`Puppy with ID ${puppyId} not found`);
    }
    
    return { puppy };
  }
});

export const getAdoptionRequirements = defineTool({
  name: 'getAdoptionRequirements',
  description: 'Get adoption requirements for a specific puppy',
  parameters: [
    { name: 'puppyId', type: 'string', description: 'ID of the puppy' },
  ],
  execute: async ({ puppyId }) => {
    const puppy = await prisma.puppy.findUnique({
      where: { id: puppyId },
      include: {
        shelter: {
          include: {
            adoptionRequirements: true,
          },
        },
      },
    });
    
    if (!puppy) {
      throw new Error(`Puppy with ID ${puppyId} not found`);
    }
    
    return {
      requirements: puppy.shelter.adoptionRequirements,
      adoptionFee: puppy.adoptionFee,
      shelter: puppy.shelter,
    };
  }
});

export const startAdoptionProcess = defineTool({
  name: 'startAdoptionProcess',
  description: 'Start the adoption process for a puppy',
  parameters: [
    { name: 'puppyId', type: 'string', description: 'ID of the puppy' },
    { name: 'userId', type: 'string', description: 'ID of the user' },
  ],
  execute: async ({ puppyId, userId }) => {
    // Create adoption application
    const application = await prisma.adoptionApplication.create({
      data: {
        puppyId,
        userId,
        status: 'PENDING',
      },
    });
    
    // Return application details
    return { applicationId: application.id, status: application.status };
  }
});
```

### Step 2: Define Prompt Components

Create reusable prompt components:

```typescript
// app/lib/agents/puppy-adoption-prompts.tsx
import { SystemMessage } from '@acme/agent-framework/priompt';

export function PuppySearchPrompt({ userPreferences }) {
  return (
    <SystemMessage>
      The user is looking for a puppy with the following preferences:
      - Breed: {userPreferences.breed || 'Any'}
      - Age: {userPreferences.ageMonths ? `${userPreferences.ageMonths} months or younger` : 'Any'}
      - Size: {userPreferences.size || 'Any'}
      - Good with kids: {userPreferences.goodWithKids ? 'Yes' : 'Not specified'}
      - Location: {userPreferences.location || 'Any'}
      
      Help the user refine their preferences if needed. Ask about any missing preferences
      that would help find the right puppy for them.
    </SystemMessage>
  );
}

export function PuppyRecommendationPrompt({ puppies }) {
  return (
    <SystemMessage>
      Based on the user's preferences, here are some puppies that might be a good match:
      
      {puppies.length === 0 ? (
        'No puppies found matching these criteria. Please suggest broadening the search criteria.'
      ) : (
        puppies.map((puppy, i) => `
          Puppy ${i + 1}: ${puppy.name}
          - Breed: ${puppy.breed}
          - Age: ${puppy.ageMonths} months
          - Size: ${puppy.size}
          - Good with kids: ${puppy.goodWithKids ? 'Yes' : 'No'}
          - Location: ${puppy.location}
          - ID: ${puppy.id}
        `).join('\n\n')
      )}
      
      Ask the user if they're interested in any specific puppy. If they are,
      you can get more details about that puppy with the getPuppyDetails tool.
    </SystemMessage>
  );
}

export function PuppyDetailsPrompt({ puppy }) {
  return (
    <SystemMessage>
      Here are detailed information about ${puppy.name}:
      
      Basic information:
      - Name: ${puppy.name}
      - Breed: ${puppy.breed}
      - Age: ${puppy.ageMonths} months
      - Size: ${puppy.size}
      - Good with kids: ${puppy.goodWithKids ? 'Yes' : 'No'}
      - Good with other pets: ${puppy.goodWithPets ? 'Yes' : 'No'}
      - Location: ${puppy.location}
      
      Health information:
      - Vaccinated: ${puppy.vaccinated ? 'Yes' : 'No'}
      - Microchipped: ${puppy.microchipped ? 'Yes' : 'No'}
      - Spayed/Neutered: ${puppy.spayedNeutered ? 'Yes' : 'No'}
      
      About ${puppy.name}:
      ${puppy.description}
      
      Shelter information:
      - Name: ${puppy.shelter.name}
      - Location: ${puppy.shelter.location}
      - Contact: ${puppy.shelter.phone}
      
      Ask the user if they would like to know about the adoption requirements
      or if they're interested in starting the adoption process.
    </SystemMessage>
  );
}

export function AdoptionRequirementsPrompt({ requirements, adoptionFee, shelter }) {
  return (
    <SystemMessage>
      Adoption Requirements from ${shelter.name}:
      
      ${requirements.map((req, i) => `${i + 1}. ${req.description}`).join('\n')}
      
      Adoption Fee: $${adoptionFee}
      
      The adoption process typically involves:
      1. Submitting an application
      2. Interview with shelter staff
      3. Home visit (for some shelters)
      4. Paying the adoption fee
      5. Signing adoption papers
      
      Would the user like to start the adoption process?
    </SystemMessage>
  );
}
```

### Step 3: Define the Agent

Create the agent definition:

```typescript
// app/lib/agents/puppy-adoption-agent.ts
import { defineAgent } from '@acme/agent-framework';
import { SystemMessage, UserMessage, AssistantMessage } from '@acme/agent-framework/priompt';
import {
  PuppySearchPrompt,
  PuppyRecommendationPrompt,
  PuppyDetailsPrompt,
  AdoptionRequirementsPrompt
} from './puppy-adoption-prompts';
import {
  searchPuppies,
  getPuppyDetails,
  getAdoptionRequirements,
  startAdoptionProcess
} from './puppy-adoption-tools';

export const puppyAdoptionAgent = defineAgent({
  name: 'PuppyAdoptionAgent',
  description: 'Helps users find and adopt puppies',
  
  // Initial state for the agent
  initialState: {
    adoptionFlow: 'initial', // initial, search, recommendation, details, requirements, application
  },
  
  // Memory structure
  memory: {
    userPreferences: {},
    foundPuppies: [],
    selectedPuppy: null,
    adoptionRequirements: null,
  },
  
  // Register tools
  tools: [
    searchPuppies,
    getPuppyDetails,
    getAdoptionRequirements,
    startAdoptionProcess,
  ],
  
  // Define handlers for different states
  handlers: {
    // Initial state handler - collect user preferences
    initial: async (input, context) => {
      // Extract preferences from input
      const preferences = extractPreferences(input.content);
      
      // Update memory with preferences
      context.memory.userPreferences = {
        ...context.memory.userPreferences,
        ...preferences,
      };
      
      // Transition to search state if we have enough preferences
      if (hasEnoughPreferences(context.memory.userPreferences)) {
        context.state.transition('search', 'Gathered enough preferences');
      }
      
      // Generate response based on current preferences
      return (
        <>
          <SystemMessage>
            You are a puppy adoption assistant. Your goal is to help users find
            and adopt puppies that match their preferences.
          </SystemMessage>
          
          <PuppySearchPrompt userPreferences={context.memory.userPreferences} />
          
          <UserMessage>{input.content}</UserMessage>
        </>
      );
    },
    
    // Search state handler - search for puppies based on preferences
    search: async (input, context) => {
      // Extract additional preferences from input
      const preferences = extractPreferences(input.content);
      
      // Update memory with preferences
      context.memory.userPreferences = {
        ...context.memory.userPreferences,
        ...preferences,
      };
      
      // Search for puppies
      try {
        const { puppies } = await context.tools.execute('searchPuppies', context.memory.userPreferences);
        
        // Store puppies in memory
        context.memory.foundPuppies = puppies;
        
        // Transition to recommendation state
        context.state.transition('recommendation', 'Found puppies to recommend');
        
        // Generate response with puppy recommendations
        return (
          <>
            <SystemMessage>
              You are a puppy adoption assistant. Your goal is to help users find
              and adopt puppies that match their preferences.
            </SystemMessage>
            
            <PuppyRecommendationPrompt puppies={puppies} />
            
            <UserMessage>{input.content}</UserMessage>
          </>
        );
      } catch (error) {
        // Handle search error
        console.error('Puppy search error:', error);
        
        return (
          <>
            <SystemMessage>
              You are a puppy adoption assistant. Your goal is to help users find
              and adopt puppies that match their preferences.
              
              There was an error searching for puppies. Apologize to the user and
              ask them to try again with different preferences.
            </SystemMessage>
            
            <UserMessage>{input.content}</UserMessage>
          </>
        );
      }
    },
    
    // Recommendation state handler - help user select a puppy
    recommendation: async (input, context) => {
      // Check if the user has selected a puppy
      const puppyId = extractPuppyId(input.content, context.memory.foundPuppies);
      
      if (puppyId) {
        try {
          // Get puppy details
          const { puppy } = await context.tools.execute('getPuppyDetails', { puppyId });
          
          // Store selected puppy in memory
          context.memory.selectedPuppy = puppy;
          
          // Transition to details state
          context.state.transition('details', 'User selected a puppy');
          
          // Generate response with puppy details
          return (
            <>
              <SystemMessage>
                You are a puppy adoption assistant. Your goal is to help users find
                and adopt puppies that match their preferences.
              </SystemMessage>
              
              <PuppyDetailsPrompt puppy={puppy} />
              
              <UserMessage>{input.content}</UserMessage>
            </>
          );
        } catch (error) {
          // Handle puppy details error
          console.error('Puppy details error:', error);
          
          return (
            <>
              <SystemMessage>
                You are a puppy adoption assistant. Your goal is to help users find
                and adopt puppies that match their preferences.
                
                There was an error getting details for the selected puppy. Apologize
                to the user and ask them to select a different puppy.
              </SystemMessage>
              
              <PuppyRecommendationPrompt puppies={context.memory.foundPuppies} />
              
              <UserMessage>{input.content}</UserMessage>
            </>
          );
        }
      }
      
      // User hasn't selected a puppy yet
      return (
        <>
          <SystemMessage>
            You are a puppy adoption assistant. Your goal is to help users find
            and adopt puppies that match their preferences.
          </SystemMessage>
          
          <PuppyRecommendationPrompt puppies={context.memory.foundPuppies} />
          
          <UserMessage>{input.content}</UserMessage>
        </>
      );
    },
    
    // Details state handler - show puppy details and next steps
    details: async (input, context) => {
      // Check if the user wants adoption requirements
      if (isInterestedInRequirements(input.content)) {
        try {
          // Get adoption requirements
          const { requirements, adoptionFee, shelter } = await context.tools.execute(
            'getAdoptionRequirements',
            { puppyId: context.memory.selectedPuppy.id }
          );
          
          // Store adoption requirements in memory
          context.memory.adoptionRequirements = { requirements, adoptionFee, shelter };
          
          // Transition to requirements state
          context.state.transition('requirements', 'User interested in adoption requirements');
          
          // Generate response with adoption requirements
          return (
            <>
              <SystemMessage>
                You are a puppy adoption assistant. Your goal is to help users find
                and adopt puppies that match their preferences.
              </SystemMessage>
              
              <AdoptionRequirementsPrompt
                requirements={requirements}
                adoptionFee={adoptionFee}
                shelter={shelter}
              />
              
              <UserMessage>{input.content}</UserMessage>
            </>
          );
        } catch (error) {
          // Handle requirements error
          console.error('Adoption requirements error:', error);
          
          return (
            <>
              <SystemMessage>
                You are a puppy adoption assistant. Your goal is to help users find
                and adopt puppies that match their preferences.
                
                There was an error getting the adoption requirements. Apologize to
                the user and suggest they contact the shelter directly.
              </SystemMessage>
              
              <PuppyDetailsPrompt puppy={context.memory.selectedPuppy} />
              
              <UserMessage>{input.content}</UserMessage>
            </>
          );
        }
      }
      
      // Continue showing puppy details
      return (
        <>
          <SystemMessage>
            You are a puppy adoption assistant. Your goal is to help users find
            and adopt puppies that match their preferences.
          </SystemMessage>
          
          <PuppyDetailsPrompt puppy={context.memory.selectedPuppy} />
          
          <UserMessage>{input.content}</UserMessage>
        </>
      );
    },
    
    // Requirements state handler - handle adoption application
    requirements: async (input, context) => {
      // Check if the user wants to start the adoption process
      if (isReadyToAdopt(input.content)) {
        // In a real application, you would get the user ID from the session
        const userId = 'user-123';
        
        try {
          // Start the adoption process
          const { applicationId, status } = await context.tools.execute('startAdoptionProcess', {
            puppyId: context.memory.selectedPuppy.id,
            userId,
          });
          
          // Transition to application state
          context.state.transition('application', 'User started adoption application');
          
          // Generate response with application confirmation
          return (
            <>
              <SystemMessage>
                You are a puppy adoption assistant. Your goal is to help users find
                and adopt puppies that match their preferences.
                
                The user has successfully started the adoption process for {context.memory.selectedPuppy.name}.
                Their application ID is {applicationId} and the current status is {status}.
                
                Explain that they will be contacted by the shelter for the next steps,
                and thank them for choosing to adopt a puppy.
              </SystemMessage>
              
              <UserMessage>{input.content}</UserMessage>
            </>
          );
        } catch (error) {
          // Handle application error
          console.error('Adoption application error:', error);
          
          return (
            <>
              <SystemMessage>
                You are a puppy adoption assistant. Your goal is to help users find
                and adopt puppies that match their preferences.
                
                There was an error starting the adoption process. Apologize to the
                user and suggest they try again later or contact the shelter directly.
              </SystemMessage>
              
              <UserMessage>{input.content}</UserMessage>
            </>
          );
        }
      }
      
      // Continue showing adoption requirements
      return (
        <>
          <SystemMessage>
            You are a puppy adoption assistant. Your goal is to help users find
            and adopt puppies that match their preferences.
          </SystemMessage>
          
          <AdoptionRequirementsPrompt
            requirements={context.memory.adoptionRequirements.requirements}
            adoptionFee={context.memory.adoptionRequirements.adoptionFee}
            shelter={context.memory.adoptionRequirements.shelter}
          />
          
          <UserMessage>{input.content}</UserMessage>
        </>
      );
    },
    
    // Application state handler - provide application status
    application: async (input, context) => {
      // Generate response with application status
      return (
        <>
          <SystemMessage>
            You are a puppy adoption assistant. Your goal is to help users find
            and adopt puppies that match their preferences.
            
            The user has already started the adoption process for {context.memory.selectedPuppy.name}.
            They should have received an email with details about the next steps.
            
            If they have questions about their application, suggest they contact
            the shelter directly.
          </SystemMessage>
          
          <UserMessage>{input.content}</UserMessage>
        </>
      );
    },
  },
  
  // Process incoming message
  async processMessage(input, context) {
    // Get current state
    const currentState = context.state.current;
    
    // Call the appropriate handler based on the current state
    const handler = this.handlers[currentState];
    if (handler) {
      return await handler(input, context);
    }
    
    // Fallback to initial state handler
    return await this.handlers.initial(input, context);
  },
});

// Helper functions

function extractPreferences(text) {
  const preferences = {};
  
  // Extract breed
  const breedMatch = text.match(/breed:?\s*([a-zA-Z\s]+)/i);
  if (breedMatch && breedMatch[1]) {
    preferences.breed = breedMatch[1].trim();
  }
  
  // Extract age
  const ageMatch = text.match(/age:?\s*(\d+)\s*months?/i);
  if (ageMatch && ageMatch[1]) {
    preferences.ageMonths = parseInt(ageMatch[1], 10);
  }
  
  // Extract size
  const sizeMatch = text.match(/size:?\s*(small|medium|large)/i);
  if (sizeMatch && sizeMatch[1]) {
    preferences.size = sizeMatch[1].toLowerCase();
  }
  
  // Extract good with kids
  const kidsMatch = text.match(/good with kids:?\s*(yes|no|true|false)/i);
  if (kidsMatch && kidsMatch[1]) {
    preferences.goodWithKids = ['yes', 'true'].includes(kidsMatch[1].toLowerCase());
  }
  
  // Extract location
  const locationMatch = text.match(/location:?\s*([a-zA-Z\s,]+)/i);
  if (locationMatch && locationMatch[1]) {
    preferences.location = locationMatch[1].trim();
  }
  
  return preferences;
}

function hasEnoughPreferences(preferences) {
  // Check if we have at least one major preference
  return Object.keys(preferences).length >= 1;
}

function extractPuppyId(text, puppies) {
  // Check for puppy ID in the text
  const idMatch = text.match(/(?:puppy|id)(?:\s+|\s*:\s*)([a-zA-Z0-9-]+)/i);
  if (idMatch && idMatch[1]) {
    return idMatch[1];
  }
  
  // Check for puppy name in the text
  for (const puppy of puppies) {
    if (text.toLowerCase().includes(puppy.name.toLowerCase())) {
      return puppy.id;
    }
  }
  
  return null;
}

function isInterestedInRequirements(text) {
  // Check if the user is interested in adoption requirements
  const requirementsRegex = /(?:requirements|adopt|adoption|process|how to adopt)/i;
  return requirementsRegex.test(text);
}

function isReadyToAdopt(text) {
  // Check if the user is ready to start the adoption process
  const adoptRegex = /(?:start|begin|apply|adoption|process|submit|application)/i;
  return adoptRegex.test(text);
}
```

### Step 4: Create API Route

Create an API route for the agent:

```typescript
// app/api/agents/puppy-adoption/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { StreamingTextResponse } from 'ai';
import { agentFramework } from '@/app/lib/agent-framework';
import { puppyAdoptionAgent } from '@/app/lib/agents/puppy-adoption-agent';

export async function POST(request: NextRequest) {
  try {
    const { messages, sessionId } = await request.json();
    
    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    if (latestMessage.role !== 'user') {
      return NextResponse.json(
        { error: 'Last message must be from the user' },
        { status: 400 }
      );
    }
    
    // Get or create an agent instance
    const agent = await agentFramework.getAgent({
      definition: puppyAdoptionAgent,
      sessionId,
    });
    
    // Process the latest message
    const { text, stream } = await agent.processStreaming({
      type: 'message',
      content: latestMessage.content,
    });
    
    // Return streaming response
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Agent error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
```

### Step 5: Create Client Component

Create a client component for the chat interface:

```typescript
// app/components/puppy-adoption-chat.tsx
'use client';

import { useState, useEffect } from 'react';
import { useChat } from 'ai/react';

export function PuppyAdoptionChat() {
  const [sessionId] = useState(() => localStorage.getItem('chatSessionId') || crypto.randomUUID());
  
  // Store session ID in localStorage
  useEffect(() => {
    localStorage.setItem('chatSessionId', sessionId);
  }, [sessionId]);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/agents/puppy-adoption',
    body: {
      sessionId,
    },
  });
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h2 className="text-lg font-semibold mb-2">Welcome to Puppy Adoption Assistant!</h2>
            <p>I can help you find the perfect puppy for adoption. You can tell me about your preferences, such as:</p>
            <ul className="list-disc list-inside text-left mt-2">
              <li>Breed preference</li>
              <li>Age range</li>
              <li>Size (small, medium, large)</li>
              <li>Whether you need a puppy good with kids</li>
              <li>Your location</li>
            </ul>
            <p className="mt-2">How can I help you find your new puppy companion today?</p>
          </div>
        )}
        
        {/* Chat messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-100 ml-12' 
                : 'bg-gray-100 mr-12'
            }`}
          >
            <p className="text-sm font-semibold text-gray-500 mb-1">
              {message.role === 'user' ? 'You' : 'Puppy Adoption Assistant'}
            </p>
            {message.content}
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="bg-gray-100 p-4 rounded-lg mr-12 animate-pulse">
            <p className="text-sm font-semibold text-gray-500 mb-1">
              Puppy Adoption Assistant
            </p>
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 p-4 rounded-lg text-red-700">
            <p>An error occurred. Please try again.</p>
          </div>
        )}
      </div>
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about puppy adoption..."
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
```

### Step 6: Create Page Component

Create a page component to host the chat interface:

```typescript
// app/puppy-adoption/page.tsx
import { PuppyAdoptionChat } from '@/app/components/puppy-adoption-chat';

export const metadata = {
  title: 'Puppy Adoption Assistant',
  description: 'Find your perfect puppy companion with our adoption assistant',
};

export default function PuppyAdoptionPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">Puppy Adoption Assistant</h1>
      <p className="text-gray-600 mb-6">
        Chat with our AI assistant to find your perfect puppy companion
      </p>
      
      <div className="border border-gray-200 rounded-lg shadow-sm h-[600px] overflow-hidden">
        <PuppyAdoptionChat />
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        <h2 className="font-semibold text-gray-600 mb-2">About This Service</h2>
        <p>
          This puppy adoption assistant helps you find and adopt puppies based on
          your preferences. It connects you with shelters and guides you through
          the adoption process. All puppies shown are looking for their forever homes.
        </p>
      </div>
    </div>
  );
}
```

## Database Schema

This example uses the following Prisma schema:

```prisma
// prisma/schema.prisma
model Puppy {
  id              String    @id @default(cuid())
  name            String
  breed           String
  ageMonths       Int
  size            String    // small, medium, large
  goodWithKids    Boolean   @default(false)
  goodWithPets    Boolean   @default(false)
  vaccinated      Boolean   @default(false)
  microchipped    Boolean   @default(false)
  spayedNeutered  Boolean   @default(false)
  description     String
  adoptionFee     Float
  location        String
  adopted         Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  shelterId       String
  shelter         Shelter   @relation(fields: [shelterId], references: [id])
  medicalRecords  MedicalRecord[]
  photos          PuppyPhoto[]
  applications    AdoptionApplication[]
}

model Shelter {
  id                   String    @id @default(cuid())
  name                 String
  location             String
  phone                String
  email                String
  description          String
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  
  // Relations
  puppies              Puppy[]
  adoptionRequirements AdoptionRequirement[]
}

model AdoptionRequirement {
  id          String    @id @default(cuid())
  description String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  shelterId   String
  shelter     Shelter   @relation(fields: [shelterId], references: [id])
}

model MedicalRecord {
  id          String    @id @default(cuid())
  type        String
  date        DateTime
  notes       String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  puppyId     String
  puppy       Puppy     @relation(fields: [puppyId], references: [id])
}

model PuppyPhoto {
  id          String    @id @default(cuid())
  url         String
  isPrimary   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  
  // Relations
  puppyId     String
  puppy       Puppy     @relation(fields: [puppyId], references: [id])
}

model AdoptionApplication {
  id          String    @id @default(cuid())
  status      String    // PENDING, APPROVED, REJECTED
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  puppyId     String
  puppy       Puppy     @relation(fields: [puppyId], references: [id])
  userId      String
  user        User      @relation(fields: [userId], references: [id])
}

model User {
  id          String    @id @default(cuid())
  name        String
  email       String    @unique
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  applications AdoptionApplication[]
}
```

## Running the Example

To run this example:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```

3. Seed the database with sample puppies:
   ```bash
   npx prisma db seed
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Navigate to http://localhost:3000/puppy-adoption

## Conclusion

This example demonstrates a complete agent implementation for a puppy adoption service. It showcases:

1. State-based agent design
2. Tool definitions for external actions
3. Reusable prompt components
4. Integration with a database
5. Client-side chat interface
6. Streaming responses

The agent framework provides a structured approach to building complex, stateful, task-oriented agents that can guide users through multi-step processes.

================
File: integration-guide.md
================
# Agent Framework Integration Guide

This document describes how to integrate the agent framework into a NextJS application.

## Installation

```bash
npm install @acme/agent-framework
# or
yarn add @acme/agent-framework
# or
pnpm add @acme/agent-framework
```

## Basic Integration

### 1. Initialize the Framework

Create a file called `agent-framework.ts` in your project:

```typescript
// app/lib/agent-framework.ts
import { createAgentFramework } from '@acme/agent-framework';

export const agentFramework = createAgentFramework({
  storage: {
    type: 'memory', // Use 'durable-object' or 'database' in production
  },
  eventBus: {
    type: 'memory', // Use 'queue' in production
  },
});
```

### 2. Create an Agent Definition

```typescript
// app/lib/agents/pet-adoption-agent.ts
import { defineAgent } from '@acme/agent-framework';
import { PriomptTemplate } from '@acme/agent-framework/priompt';

// Define the agent with a name and description
export const petAdoptionAgent = defineAgent({
  name: 'PetAdoptionAgent',
  description: 'Helps users find and adopt pets based on their preferences',
  
  // Define the initial state of the agent
  initialState: {
    adoptionFlow: 'initial',
  },
  
  // Define the agent's memory structure
  memory: {
    userPreferences: null,
    recommendedPets: [],
    adoptionSteps: [],
  },
  
  // Define the agent's tools
  tools: [
    {
      name: 'searchPets',
      description: 'Search for pets based on user preferences',
      parameters: [
        { name: 'animalType', type: 'string', description: 'Type of animal (dog, cat, etc.)' },
        { name: 'breed', type: 'string', description: 'Breed of the animal', required: false },
        { name: 'age', type: 'string', description: 'Age range of the animal', required: false },
        { name: 'location', type: 'string', description: 'Location for adoption', required: false },
      ],
      execute: async (params) => {
        // Implement pet search logic here
        return { pets: [] };
      },
    },
    {
      name: 'getAdoptionRequirements',
      description: 'Get adoption requirements for a pet',
      parameters: [
        { name: 'petId', type: 'string', description: 'ID of the pet' },
      ],
      execute: async (params) => {
        // Implement adoption requirements logic here
        return { requirements: [] };
      },
    },
  ],
  
  // Define the agent's system prompt template
  systemPrompt: ({ agent }) => (
    <SystemMessage>
      You are a helpful pet adoption assistant that helps users find and adopt pets.
      Your goal is to understand user preferences, recommend suitable pets, and guide them through the adoption process.
      
      Current adoption flow: {agent.state.adoptionFlow}
    </SystemMessage>
  ),
});
```

### 3. Create an API Route for the Agent

```typescript
// app/api/agents/pet-adoption/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { agentFramework } from '@/app/lib/agent-framework';
import { petAdoptionAgent } from '@/app/lib/agents/pet-adoption-agent';

// Create a route handler for agent interactions
export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();
    
    // Get or create an agent instance
    const agent = await agentFramework.getAgent({
      definition: petAdoptionAgent,
      sessionId,
    });
    
    // Process the user message
    const response = await agent.process({ type: 'message', content: message });
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Agent error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
```

### 4. Create a Client Component

```typescript
// app/components/pet-adoption-chat.tsx
'use client';

import { useState } from 'react';
import { useChat } from '@/app/hooks/use-chat';

export function PetAdoptionChat() {
  const [sessionId] = useState(() => crypto.randomUUID());
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/agents/pet-adoption',
    sessionId,
  });
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded ${
              message.role === 'user' ? 'bg-blue-100 ml-12' : 'bg-gray-100 mr-12'
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && <div className="text-gray-500">The adoption assistant is thinking...</div>}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about pet adoption..."
            className="flex-1 p-2 border rounded-l"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-r"
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
```

### 5. Use the Component in a Page

```typescript
// app/pet-adoption/page.tsx
import { PetAdoptionChat } from '@/app/components/pet-adoption-chat';

export default function PetAdoptionPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pet Adoption Assistant</h1>
      <div className="border rounded h-[600px]">
        <PetAdoptionChat />
      </div>
    </div>
  );
}
```

## Advanced Integration

### Using Server Components

You can use the agent framework directly in Server Components:

```typescript
// app/pet-adoption/[id]/page.tsx
import { agentFramework } from '@/app/lib/agent-framework';
import { petAdoptionAgent } from '@/app/lib/agents/pet-adoption-agent';

export default async function PetAdoptionDetailPage({ params }: { params: { id: string } }) {
  // Get pet details
  const petId = params.id;
  
  // Use the agent to get adoption requirements
  const agent = await agentFramework.getAgent({
    definition: petAdoptionAgent,
    sessionId: 'server-component',
  });
  
  const requirements = await agent.tools.execute('getAdoptionRequirements', { petId });
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Adoption Requirements</h1>
      <ul className="list-disc pl-5">
        {requirements.requirements.map((req: string, i: number) => (
          <li key={i}>{req}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Using Edge Runtime

For optimal performance, you can run agents at the edge:

```typescript
// app/api/agents/pet-adoption/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { agentFramework } from '@/app/lib/agent-framework';
import { petAdoptionAgent } from '@/app/lib/agents/pet-adoption-agent';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  // ... (same as before)
}
```

### Using Middleware

You can use middleware to process incoming requests:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { agentFramework } from '@/app/lib/agent-framework';

export function middleware(request: NextRequest) {
  // Check if the request is for an agent endpoint
  if (request.nextUrl.pathname.startsWith('/api/agents/')) {
    // Log the request
    agentFramework.eventBus.publish({
      type: 'agent.request',
      source: 'middleware',
      data: {
        path: request.nextUrl.pathname,
        method: request.method,
      },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/agents/:path*',
};
```

## Using with Vercel AI SDK

The agent framework integrates with the Vercel AI SDK:

```typescript
// app/api/agents/pet-adoption/route.ts
import { StreamingTextResponse, LangChainStream } from 'ai';
import { agentFramework } from '@/app/lib/agent-framework';
import { petAdoptionAgent } from '@/app/lib/agents/pet-adoption-agent';

export async function POST(request: NextRequest) {
  try {
    const { messages, sessionId } = await request.json();
    
    // Get or create an agent instance
    const agent = await agentFramework.getAgent({
      definition: petAdoptionAgent,
      sessionId,
    });
    
    // Create a streaming response
    const { stream, handlers } = LangChainStream();
    
    // Process in the background
    agent.processStreaming({
      messages,
      onToken: handlers.handleLLMNewToken,
      onComplete: handlers.handleLLMEnd,
      onError: handlers.handleLLMError,
    });
    
    // Return a streaming response
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Agent error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
```

## Configuration Options

### Storage Options

```typescript
// Memory storage (development)
storage: {
  type: 'memory',
}

// Durable Object storage (production)
storage: {
  type: 'durable-object',
  namespace: env.AGENT_NAMESPACE,
}

// Database storage (production)
storage: {
  type: 'database',
  url: process.env.DATABASE_URL,
}
```

### Event Bus Options

```typescript
// Memory event bus (development)
eventBus: {
  type: 'memory',
}

// Queue event bus (production)
eventBus: {
  type: 'queue',
  queueName: 'agent-events',
}
```

### Task Tracker Options

```typescript
// Memory task tracker (development)
taskTracker: {
  type: 'memory',
}

// Database task tracker (production)
taskTracker: {
  type: 'database',
  url: process.env.DATABASE_URL,
}
```

//

SPROUT PROMPT:

# **lol: Authentic Moments, Enhanced by AI**

> *A social app that uses AI to create genuine, expressive interactions between friends without the pressure of perfect posts.*

## Concept Overview
lol reimagines the authenticity movement pioneered by BeReal, addressing the platform's declining engagement by introducing AI-powered features that enhance genuine social connections rather than replacing them. The app maintains the core "2-minute window" for posting unfiltered content from both cameras but adds AI companions that help users express themselves, analyze emotional contexts, and create meaningful interactions with friends. 

Targeting Gen Z and Alpha users (16-25 as the primary demographic), lol taps into the proven desire for authentic social media while solving the "mundane content problem" that has plagued BeReal. By 2025, with ATT opt-in rates reaching 35% and AI integration becoming standard (88% of marketers using AI daily), the timing is perfect for a platform that thoughtfully combines authenticity with AI enhancement.

## Core Features

* **Emotion-Enhanced Captures**: The dual-camera system analyzes facial expressions and environmental context, subtly enhancing the mood of photos through AI-generated visual elements (like weather effects that match your emotional state) while preserving the authentic moment.

* **AI Memory Journals**: The app creates private, personalized memory collections by recognizing patterns in your daily posts, helping you appreciate the evolution of your routines, relationships, and environments over time.

* **Contextual Prompts**: Unlike BeReal's generic notification, AI analyzes your typical daily patterns and sends notifications during potentially meaningful moments (significant location changes, gatherings with friends, or unusual activities).

* **Friend Insights**: An AI companion analyzes mutual interactions and suggests meaningful ways to engage with friends based on their recent posts, moods, and shared experiences, deepening connections beyond superficial likes.

* **Authentic Reactions**: Replace generic emoji reactions with AI-generated personalized responses that match your speaking style and relationship with each friend, making digital interactions feel more genuine.

## User Experience

lol maintains a minimalist, monochromatic interface with intuitive gestures that emphasize content over UI. The daily notification prompts users to capture their moment within 2 minutes, but the AI-enhanced camera subtly detects emotions and environmental context to add gentle visual enhancements that amplify the mood without filtering reality. Users can toggle between "Pure Real" (unenhanced) and "Feel Real" (AI-enhanced) modes.

The social feed shows friends' daily moments with their emotion indicators, and tapping on posts reveals AI-suggested personal responses based on your relationship history. The Memory Journal provides a private space where users can see AI-curated collections of their own moments, organized by emotional patterns, locations, or significant life changes detected over time.

## Technical Implementation

The app leverages Next.js with React Server Components for the frontend and Vercel Edge Functions for real-time AI processing. The core architecture includes:

1. **Durable Objects** for maintaining stateful chat rooms and user sessions, eliminating the connection issues that plagued BeReal
2. **OpenRouter integration** for accessing multiple AI models specialized in emotion recognition and content generation
3. **Upstash Redis** for fast, serverless data storage of user interactions and preferences
4. **Neon PostgreSQL** for structured data and relationship mapping between users
5. **Mastra workflow engine** for orchestrating complex AI analysis tasks across multiple services

The dual-camera capture system uses TensorFlow.js for on-device emotion analysis before sending data to more powerful server-side models for enhancement generation.

## Go-To-Market Strategy

Launch strategy centers on university campuses with a "Friend Circles" approach – users can only join if invited by 3+ existing members, creating trusted networks from the start. The app will leverage the "2-minute authenticity window" as a shareable moment, encouraging users to post their lol captures to other platforms with "This is how I really felt" messaging.

Growth will be driven by weekly AI-generated "Friendship Stories" that highlight meaningful connections between users and can be shared externally. Partnerships with mental health organizations will position the app as promoting digital well-being through authentic expression rather than performance.

## Resources & Inspiration

* [Reliable UX for AI Chat with Durable Objects](https://sunilpai.dev/posts/reliable-ux-for-ai-chat-with-durable-objects/) – Essential architecture for creating persistent, reliable real-time experiences without the disconnection issues that plagued BeReal.

* [Mastra Workflow Engine](https://github.com/zackees/mastra) – Provides the sophisticated state management needed for complex AI analysis of emotions and social contexts.

* [Priompt](https://github.com/anysphere/priompt) – JSX-based prompt design library perfect for creating the contextual, personalized AI interactions central to the app.

* [Emotion AI in Mobile Apps](https://www.affectiva.com/emotion-ai-overview) – Implementation frameworks for the facial expression recognition that powers the emotional enhancement features.

* [BeReal's Success Factors Analysis](https://www.businessofapps.com/data/bereal-statistics/) – Comprehensive understanding of what worked (and what didn't) in BeReal's approach to authentic social media.

* [Gen Alpha and Gen Z AI Companions](https://www.gartner.com/en/articles/what-gen-z-and-millennials-want-from-generative-ai) – Research on how younger generations interact with AI companions, showing preference for empathetic, playful interactions.

* [Upstash + Next.js Integration](https://github.com/upstash/jstack) – Optimal patterns for building low-cost serverless apps with Redis KV storage and Next.js.


//

LOGS::

pi && pd
Lockfile is up to date, resolution step is skipped
Already up to date
Done in 1.5s

> luke-app@0.1.0 dev /Users/nit/Developer/apps/luke
> next dev -p 9000

   ▲ Next.js 15.2.0
   - Local:        http://localhost:9000
   - Network:      http://192.168.1.227:9000
   - Environments: .env.local, .env

 ✓ Starting...
 ⚠ Invalid next.config.js options detected: 
 ⚠     Unrecognized key(s) in object: 'reactMode' at "experimental"
 ⚠ See more info here: https://nextjs.org/docs/messages/invalid-next-config
 ✓ Ready in 1583ms
 ○ Compiling /jobs ...
 ✓ Compiled /jobs in 2.7s (1612 modules)
 GET /jobs 200 in 3221ms
 ✓ Compiled in 600ms (775 modules)
 ✓ Compiled /middleware in 142ms (100 modules)
 ○ Compiling /api/jobs ...
 ✓ Compiled /api/jobs in 857ms (1745 modules)
prisma:query SELECT "public"."JobPosting"."id", "public"."JobPosting"."title", "public"."JobPosting"."company", "public"."JobPosting"."location", "public"."JobPosting"."type", "public"."JobPosting"."description", "public"."JobPosting"."url", "public"."JobPosting"."source", "public"."JobPosting"."techs", "public"."JobPosting"."salary", "public"."JobPosting"."crawledAt", "public"."JobPosting"."processed", "public"."JobPosting"."matches" FROM "public"."JobPosting" WHERE 1=1 ORDER BY "public"."JobPosting"."crawledAt" DESC OFFSET $1
 GET /api/jobs 200 in 2307ms
 GET /jobs 200 in 171ms
prisma:query SELECT 1
prisma:query SELECT "public"."JobPosting"."id", "public"."JobPosting"."title", "public"."JobPosting"."company", "public"."JobPosting"."location", "public"."JobPosting"."type", "public"."JobPosting"."description", "public"."JobPosting"."url", "public"."JobPosting"."source", "public"."JobPosting"."techs", "public"."JobPosting"."salary", "public"."JobPosting"."crawledAt", "public"."JobPosting"."processed", "public"."JobPosting"."matches" FROM "public"."JobPosting" WHERE 1=1 ORDER BY "public"."JobPosting"."crawledAt" DESC OFFSET $1
 GET /api/jobs 200 in 130ms
 ○ Compiling /api/ideas/random ...
 ✓ Compiled /api/ideas/random in 1462ms (1710 modules)
[SEARCH] Processing search with mode: refine, input: ai native app for gen alpha / gen z audience - be 
[SEARCH] Generated 3 search queries for mode: refine
[SEARCH] Searching with Sonar Reasoning: best practices and design patterns for ai native app apps in March 2025...
[REQUEST] Random idea generation request received
[INFO] Enhancing idea with mode: refine, input length: 170227
[PLAN] Generating search plan for input: "ai native app for gen alpha / gen z audience - be real with ai - empathy/playful/fun/utilitarian

//..."
[LLM INPUT] Claude search plan prompt: "
You are a search strategist tasked with creating the optimal set of 3-4 search queries to gather comprehensive information for generating a viral app..."
[API] Calling Claude to generate search plan...
[LLM OUTPUT] Claude search plan response: [
  "Gen Alpha Gen Z AI companion apps features empathy playfulness utility 2024 trends",
  "AI native mobile applications for teenagers children authentic interactions psychology research",
  "BeReal app success factors authentic social media Gen Z engagement statistics 2023-2024",
  "AI emotional intelligence frameworks for mobile applications real-time empathy generation technologies"
]
[PLAN] Generated search plan with 4 queries: ["Gen Alpha Gen Z AI companion apps features empathy playfulness utility 2024 trends","AI native mobile applications for teenagers children authentic interactions psychology research","BeReal app success factors authentic social media Gen Z engagement statistics 2023-2024","AI emotional intelligence frameworks for mobile applications real-time empathy generation technologies"]
[INFO] Generated 4 search queries
[INFO] Executing initial search queries...
[INFO] Processing search query: "Gen Alpha Gen Z AI companion apps features empathy playfulness utility 2024 trends..."
[SEARCH] Executing Sonar Reasoning query: "Gen Alpha Gen Z AI companion apps features empathy playfulness utility 2024 trends..."
[SEARCH] Sonar Reasoning search completed successfully for "Design Best Practices"
[SEARCH] Extracted 5 links from search results
[SEARCH] Searching with Sonar Reasoning: technical implementation strategies for ai native app applications using modern frameworks...
[SEARCH] Sonar Reasoning response received (6562 chars)
[SEARCH] Sample result: "<think>
Okay, let's tackle this query about Gen Alpha and Gen Z's AI companion apps in 2024, focusing on features like empathy, playfulness, and utili..."
[INFO] Search query completed, received 6562 chars
[INFO] Processing search query: "AI native mobile applications for teenagers children authentic interactions psychology research..."
[SEARCH] Executing Sonar Reasoning query: "AI native mobile applications for teenagers children authentic interactions psychology research..."
[SEARCH] Sonar Reasoning search completed successfully for "Technical Architecture"
[SEARCH] Extracted 0 links from search results
[SEARCH] Searching with Sonar Reasoning: market positioning and competitive analysis for ai native app products in 2025...
[SEARCH] Sonar Reasoning response received (6364 chars)
[SEARCH] Sample result: "<think>
Okay, I need to address the query about AI native mobile applications for teenagers and children, focusing on authentic interactions and psych..."
[INFO] Search query completed, received 6364 chars
[INFO] Processing search query: "BeReal app success factors authentic social media Gen Z engagement statistics 2023-2024..."
[SEARCH] Executing Sonar Reasoning query: "BeReal app success factors authentic social media Gen Z engagement statistics 2023-2024..."
[SEARCH] Sonar Reasoning response received (5194 chars)
[SEARCH] Sample result: "<think>
Okay, let's tackle this query about BeReal's success factors, authenticity, Gen Z engagement, and the stats from 2023-2024. First, I need to g..."
[INFO] Search query completed, received 5194 chars
[INFO] Processing search query: "AI emotional intelligence frameworks for mobile applications real-time empathy generation technologi..."
[SEARCH] Executing Sonar Reasoning query: "AI emotional intelligence frameworks for mobile applications real-time empathy generation technologi..."
[SEARCH] Sonar Reasoning search completed successfully for "Market Positioning"
[SEARCH] Extracted 5 links from search results
 POST /api/ideas/search 200 in 72952ms
[SEARCH] Sonar Reasoning response received (5435 chars)
[SEARCH] Sample result: "<think>
Okay, let's tackle this query about AI emotional intelligence frameworks for mobile apps and real-time empathy generation technologies. First,..."
[INFO] Search query completed, received 5435 chars
[INFO] Completed 4 initial searches
[INFO] Extracted 0 links from search results
[INFO] Filtered to 0 unique valid links
[INFO] Generating follow-up queries based on initial results...
[FOLLOW-UP] Generating follow-up queries based on 4 search results
[LLM INPUT] Claude follow-up prompt: "
You are a search strategist tasked with analyzing search results and creating follow-up search queries to gather deeper, more specific information fo..."
[API] Calling Claude to generate follow-up queries...
[LLM OUTPUT] Claude follow-up response: I need to analyze these search results about AI companion apps for Gen Alpha and Gen Z to identify what warrants deeper investigation. Based on the information provided, I'll create follow-up search queries to gather more specific information.

["AI companion apps using emotion detection for Gen Alpha development", "hyper-personalization techniques in Gen Z AI companion apps", "gaming integration strategies for AI companions targeting Gen Alpha", "cross-platform AI assistants with defined personalities for Gen Z", "ethical considerations in AI companions for children under 13"]
[ERROR] Error parsing follow-up queries: Unexpected token 'I', "I need to "... is not valid JSON
[ERROR] Raw content: I need to analyze these search results about AI companion apps for Gen Alpha and Gen Z to identify what warrants deeper investigation. Based on the information provided, I'll create follow-up search queries to gather more specific information.

["AI companion apps using emotion detection for Gen Alpha development", "hyper-personalization techniques in Gen Z AI companion apps", "gaming integration strategies for AI companions targeting Gen Alpha", "cross-platform AI assistants with defined personalities for Gen Z", "ethical considerations in AI companions for children under 13"]
[FOLLOW-UP] Falling back to default follow-up queries: ["detailed market analysis and user demographics for like apps and services in 2025, including potential business models and monetization strategies","detailed market analysis and user demographics for apps apps and services in 2025, including potential business models and monetization strategies","detailed market analysis and user demographics for realtime apps and services in 2025, including potential business models and monetization strategies","detailed market analysis and user demographics for from apps and services in 2025, including potential business models and monetization strategies","detailed market analysis and user demographics for about apps and services in 2025, including potential business models and monetization strategies"]
[INFO] Executing follow-up queries for deeper context...
[INFO] Processing follow-up query: "detailed market analysis and user demographics for like apps..."
[SEARCH] Executing Sonar Reasoning query: "detailed market analysis and user demographics for like apps and services in 2025, including potenti..."
[SEARCH] Sonar Reasoning response received (7327 chars)
[SEARCH] Sample result: "<think>
Okay, let's tackle this query about the detailed market analysis and user demographics for apps and services in 2025, including potential busi..."
[INFO] Follow-up query completed, received 7327 chars
[INFO] Processing follow-up query: "detailed market analysis and user demographics for apps apps..."
[SEARCH] Executing Sonar Reasoning query: "detailed market analysis and user demographics for apps apps and services in 2025, including potenti..."
[SEARCH] Sonar Reasoning response received (5753 chars)
[SEARCH] Sample result: "<think>
Okay, let's tackle this query about the detailed market analysis and user demographics for apps and services in 2025, including potential busi..."
[INFO] Follow-up query completed, received 5753 chars
[INFO] Processing follow-up query: "detailed market analysis and user demographics for realtime ..."
[SEARCH] Executing Sonar Reasoning query: "detailed market analysis and user demographics for realtime apps and services in 2025, including pot..."
[SEARCH] Sonar Reasoning response received (6764 chars)
[SEARCH] Sample result: "<think>
Okay, I need to tackle this query about the detailed market analysis and user demographics for real-time apps and services in 2025, including ..."
[INFO] Follow-up query completed, received 6764 chars
[INFO] Processing follow-up query: "detailed market analysis and user demographics for from apps..."
[SEARCH] Executing Sonar Reasoning query: "detailed market analysis and user demographics for from apps and services in 2025, including potenti..."
[SEARCH] Sonar Reasoning response received (7532 chars)
[SEARCH] Sample result: "<think>
Okay, let's tackle this query about the detailed market analysis and user demographics for apps and services in 2025, including potential busi..."
[INFO] Follow-up query completed, received 7532 chars
[INFO] Processing follow-up query: "detailed market analysis and user demographics for about app..."
[SEARCH] Executing Sonar Reasoning query: "detailed market analysis and user demographics for about apps and services in 2025, including potent..."
[SEARCH] Sonar Reasoning response received (6043 chars)
[SEARCH] Sample result: "<think>
Okay, let's tackle this query about the 2025 mobile app market analysis, user demographics, business models, and monetization strategies. The ..."
[INFO] Follow-up query completed, received 6043 chars
[INFO] Completed 5 follow-up searches
[INFO] Created structured context (57061 chars)
[LLM INPUT] App idea prompt: "
You are a product refinement specialist who takes existing app concepts and enhances them with market insights, technical feasibility, and strategic positioning. You preserve the user's core vision w..."
[API] Calling Claude to generate app idea...
 ✓ Compiled in 813ms (1612 modules)
 GET /jobs 200 in 99ms
 GET /jobs 200 in 100ms
prisma:error Error in PostgreSQL connection: Error { kind: Closed, cause: None }
 ✓ Compiled in 1653ms (1612 modules)
 GET /jobs 200 in 66ms
 GET /jobs 200 in 66ms
 ✓ Compiled in 549ms (1612 modules)
 GET /jobs 200 in 84ms
 GET /jobs 200 in 87ms
[LLM OUTPUT] App idea generated (6138 chars)
[LLM OUTPUT] Sample: "# **BeRealAI: Authentic Moments, Enhanced by AI**

> *A social app that uses AI to create genuine, expressive interactions between friends without the pressure of perfect posts.*

## Concept Overview
..."
[INFO] Extracted project name: "**BeRealAI"
[INFO] Preparing response with idea and search results
 POST /api/ideas/random 200 in 263405ms

 ...

 ---

## 1. Feature Breakdown with Priorities

### 1.1 Core Features (P0)

| Feature ID | Feature Name | Description | Priority |
|------------|--------------|-------------|----------|
| F1 | Dual-Camera Capture | Simultaneous front and back camera capture within a 2-minute window | P0 |
| F2 | Emotion-Enhanced Photos | AI analysis of facial expressions with subtle visual enhancements | P0 |
| F3 | Pure/Feel Real Toggle | Switch between unfiltered and AI-enhanced versions of captured moments | P0 |
| F4 | Friend Feed | Chronological display of friends' authentic moments | P0 |
| F5 | Contextual Notifications | AI-driven alerts for potentially meaningful moments to capture | P0 |

### 1.2 Social Enhancement Features (P1)

| Feature ID | Feature Name | Description | Priority |
|------------|--------------|-------------|----------|
| F6 | AI Memory Journals | Private, personalized collections of patterns in daily posts | P1 |
| F7 | Friend Insights | AI analysis suggesting meaningful ways to engage with friends | P1 |
| F8 | Authentic Reactions | Personalized AI-generated responses matching user speaking style | P1 |
| F9 | Friendship Stories | Weekly AI-generated highlights of meaningful connections | P1 |

### 1.3 Platform & Growth Features (P2)

| Feature ID | Feature Name | Description | Priority |
|------------|--------------|-------------|----------|
| F10 | Friend Circles Invitation | Join system requiring 3+ existing member invitations | P2 |
| F11 | External Sharing | Share lol captures to other platforms with custom messaging | P2 |
| F12 | Well-being Insights | Personal patterns and emotional trends over time | P2 |
| F13 | Community Challenges | Time-limited authentic moment challenges | P2 |

---

## 2. User Stories

### 2.1 Core Capture Experience

**As a user, I want to...**

- Receive a notification at a meaningful moment so I can capture what I'm truly experiencing
- Capture both my facial expression and my surroundings simultaneously to share my complete experience
- See subtle AI enhancements that amplify my emotional state without distorting reality
- Toggle between the original and enhanced versions of my captures to maintain control over authenticity
- Have a simple, intuitive interface that emphasizes content over UI elements

### 2.2 Social Connection

**As a user, I want to...**

- View my friends' authentic moments in a chronological feed to stay connected with their real lives
- React to friends' posts with personalized responses that reflect our unique relationship
- Receive suggestions for meaningful ways to engage with friends based on their recent posts and moods
- Share my authentic moments externally when I choose to, with messaging that emphasizes the genuine nature of the content
- Join the platform through trusted friends to ensure my social circle is authentic from the start

### 2.3 Personal Insights

**As a user, I want to...**

- Access a private journal of my own moments organized by emotional patterns or significant changes
- Receive insights about my daily patterns and how they evolve over time
- Understand the emotional context of my social interactions to improve my well-being
- See weekly highlights of meaningful connections with friends to appreciate my relationships

---

## 3. Detailed Feature Specifications

### 3.1 Emotion-Enhanced Captures (F2)

**Description:**  
The dual-camera system analyzes facial expressions and environmental context in real-time, subtly enhancing the mood of photos through AI-generated visual elements while preserving the authentic moment.

**Acceptance Criteria:**
- System accurately detects at least 7 core emotions (joy, sadness, anger, fear, surprise, disgust, contempt)
- Visual enhancements are subtle and complement the mood (e.g., light effects, slight color adjustments)
- Processing completes within 3 seconds of capture
- Original unenhanced version is always preserved and accessible
- User can toggle between enhanced and original versions
- Enhancement elements are consistent with user's visual preferences

**Technical Dependencies:**
- TensorFlow.js for on-device emotion analysis
- Server-side AI models for enhancement generation
- Dual-camera API integration
- Image processing pipeline

### 3.2 AI Memory Journals (F6)

**Description:**  
The app creates private, personalized memory collections by recognizing patterns in daily posts, helping users appreciate the evolution of their routines, relationships, and environments over time.

**Acceptance Criteria:**
- System identifies at least 5 categories of patterns (locations, activities, people, emotions, time patterns)
- Memory collections update within 1 hour of new content being posted
- Users can access collections organized by pattern type
- Journal entries include original images and AI-detected patterns
- Privacy controls allow users to delete or hide specific memories
- AI generates insightful captions for detected patterns

**Technical Dependencies:**
- Pattern recognition AI models
- Secure private storage for personal data
- Image and metadata analysis pipeline
- Natural language generation for insights

### 3.3 Contextual Notifications (F5)

**Description:**  
AI analyzes typical daily patterns and sends notifications during potentially meaningful moments (significant location changes, gatherings with friends, or unusual activities).

**Acceptance Criteria:**
- System learns user patterns within 7 days of regular app use
- Notifications are sent at varying times based on detected meaningful moments
- Users receive between 1-3 notifications per day
- Notification timing avoids user's detected "busy periods"
- Users can customize notification preferences
- System detects at least 3 types of meaningful moments (location changes, social gatherings, unusual activities)

**Technical Dependencies:**
- Pattern recognition for user behavior
- Location services integration
- Push notification system
- User preference management
- Activity detection algorithms

### 3.4 Friend Insights (F7)

**Description:**  
An AI companion analyzes mutual interactions and suggests meaningful ways to engage with friends based on their recent posts, moods, and shared experiences, deepening connections beyond superficial likes.

**Acceptance Criteria:**
- System generates at least 3 personalized engagement suggestions per friend weekly
- Suggestions reflect recent posts and detected emotional states
- Users can access friend insights directly from friend profiles
- Suggestions include references to shared experiences or interests
- Privacy controls allow friends to opt out of having insights generated about them
- System avoids suggesting engagement during detected sensitive emotional states

**Technical Dependencies:**
- Relationship mapping algorithms
- Sentiment analysis of posts and interactions
- Natural language generation for suggestions
- Privacy management system

### 3.5 Authentic Reactions (F8)

**Description:**  
Replace generic emoji reactions with AI-generated personalized responses that match the user's speaking style and relationship with each friend, making digital interactions feel more genuine.

**Acceptance Criteria:**
- System learns user's communication style within 10 interactions
- Generated reactions match user's typical vocabulary, tone, and expression patterns
- Users can select from 3-5 suggested reactions or create their own
- Reactions are appropriate to the emotional context of the post
- Users can edit suggested reactions before sending
- System avoids inappropriate or insensitive suggestions

**Technical Dependencies:**
- Natural language processing for style analysis
- Personalized language generation models
- Context-aware suggestion filtering
- User feedback integration for improved suggestions

---

## 4. Technical Dependencies and Requirements

### 4.1 Frontend Requirements

- **Next.js with React Server Components**: For efficient rendering and component isolation
- **TensorFlow.js**: For on-device emotion analysis
- **WebRTC**: For dual-camera capture
- **Progressive Web App capabilities**: For native-like experience
- **Offline support**: For capture during connectivity issues
- **Responsive design**: Supporting various mobile device dimensions

### 4.2 Backend Requirements

- **Vercel Edge Functions**: For low-latency AI processing
- **Durable Objects**: For maintaining stateful chat rooms and user sessions
- **OpenRouter integration**: For accessing multiple specialized AI models
- **Upstash Redis**: For fast, serverless data storage
- **Neon PostgreSQL**: For structured data and relationship mapping
- **Mastra workflow engine**: For orchestrating complex AI analysis tasks

### 4.3 AI and Machine Learning Requirements

- **Emotion recognition models**: For detecting facial expressions and sentiment
- **Visual enhancement algorithms**: For subtle mood-based photo enhancements
- **Pattern recognition**: For identifying user behavior patterns
- **Natural language generation**: For personalized reactions and insights
- **Relationship mapping**: For understanding social connections
- **Content safety filters**: For ensuring appropriate AI-generated content

### 4.4 Security and Privacy Requirements

- **On-device processing**: For sensitive data when possible
- **End-to-end encryption**: For user communications
- **Data minimization**: Collecting only necessary information
- **User consent management**: For AI feature opt-in/out
- **GDPR and CCPA compliance**: For data protection regulations
- **Age verification**: To ensure compliance with youth protection laws

---

## 5. Implementation Phases

### 5.1 Phase 1: Core Experience (Months 1-3)

**Objectives:**
- Establish the fundamental authentic capture experience
- Implement basic AI emotion recognition
- Create the minimal viable social feed

**Features to Implement:**
- F1: Dual-Camera Capture
- F2: Emotion-Enhanced Photos (basic version)
- F3: Pure/Feel Real Toggle
- F4: Friend Feed (basic version)
- F5: Contextual Notifications (time-based only)

**Milestones:**
- Week 4: Technical architecture finalized
- Week 8: Dual-camera capture working on major devices
- Week 10: Basic emotion recognition integrated
- Week 12: Alpha testing with internal users

### 5.2 Phase 2: Social Enhancement (Months 4-6)

**Objectives:**
- Deepen the social experience with AI enhancements
- Improve emotion recognition accuracy
- Introduce personalized interactions

**Features to Implement:**
- F5: Contextual Notifications (full version)
- F7: Friend Insights
- F8: Authentic Reactions
- F10: Friend Circles Invitation

**Milestones:**
- Week 16: Enhanced emotion recognition with 90%+ accuracy
- Week 20: Friend insights generation working
- Week 22: Authentic reactions system deployed
- Week 24: Beta testing with expanded user group

### 5.3 Phase 3: Personal Growth (Months 7-9)

**Objectives:**
- Introduce personal reflection features
- Enhance pattern recognition capabilities
- Implement sharing mechanisms

**Features to Implement:**
- F6: AI Memory Journals
- F9: Friendship Stories
- F11: External Sharing
- F12: Well-being Insights

**Milestones:**
- Week 28: Memory journal pattern detection working
- Week 32: Friendship stories generation implemented
- Week 36: Public beta launch with invitation system

### 5.4 Phase 4: Community Building (Months 10-12)

**Objectives:**
- Scale the platform to wider audience
- Implement community features
- Optimize performance and reliability

**Features to Implement:**
- F13: Community Challenges
- Performance optimizations
- Extended platform compatibility
- Enhanced AI capabilities

**Milestones:**
- Week 40: Community challenges framework implemented
- Week 44: Performance metrics meeting targets (99% uptime, <2s response)
- Week 48: Full public launch
- Week 52: One million user milestone

---

## 6. Acceptance Criteria Overview

For a feature to be considered complete and ready for release, it must meet the following general criteria in addition to the specific criteria listed for each feature:

1. **Functionality**: Feature works as specified across all supported devices and platforms
2. **Performance**: Feature performs within defined latency and resource utilization parameters
3. **Reliability**: Feature maintains 99.9% uptime and handles edge cases gracefully
4. **Security**: Feature adheres to all security and privacy requirements
5. **Usability**: Feature passes user testing with at least 80% satisfaction rating
6. **Accessibility**: Feature meets WCAG 2.1 AA standards
7. **Internationalization**: Feature supports localization for target markets
8. **Analytics**: Feature includes appropriate tracking to measure engagement and performance

---

## 7. Risk Assessment and Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|------------|------------|
| AI emotion detection accuracy issues | High | Medium | Extensive training with diverse dataset; fallback to basic enhancements; user feedback loop |
| User privacy concerns | High | Medium | On-device processing where possible; clear consent flows; granular privacy controls; transparent data policies |
| Technical performance on older devices | Medium | High | Progressive enhancement approach; device-specific optimizations; reduced feature set for low-end devices |
| AI-generated content appropriateness | High | Low | Content safety filters; human review for edge cases; user reporting system; continuous model training |
| User adoption challenges | High | Medium | Friend circle invitation system; campus-focused launch strategy; authentic marketing approach; influencer partnerships |
| Regulatory compliance issues | High | Low | Regular legal reviews; privacy-by-design approach; age verification; clear terms of service |

---

This features document provides a comprehensive roadmap for the development of the "lol" application, focusing on creating an authentic social experience enhanced by thoughtful AI integration. The phased implementation approach allows for iterative development and testing, ensuring that each feature meets quality standards before moving to the next phase.
[2025-03-06T09:19:35.877Z] [INFO] [PROJECT_GEN] Generating project documentation...
Original projectContent structure: {
  "name": "lol",
  "description": "# **lol: Authentic Moments, Enhanced by AI**\n\n> *A social app that uses AI to create genuine, expressive interactions between friends without the pressure of perfect posts.*\n\n## Concept Overview\nlol reimagines the authenticity movement pioneered by BeReal, addressing the platform's declining engagement by introducing AI-powered features that enhance genuine social connections rather than replacing them. The app maintains the core \"2-minute window\" for posting unfiltered content from both cameras but adds AI companions that help users express themselves, analyze emotional contexts, and create meaningful interactions with friends. \n\nTargeting Gen Z and Alpha users (16-25 as the primary demographic), lol taps into the proven desire for authentic social media while solving the \"mundane content problem\" that has plagued BeReal. By 2025, with ATT opt-in rates reaching 35% and AI integration becoming standard (88% of marketers using AI daily), the timing is perfect for a platform that thoughtfully combines authenticity with AI enhancement.\n\n## Core Features\n\n* **Emotion-Enhanced Captures**: The dual-camera system analyzes facial expressions and environmental context, subtly enhancing the mood of photos through AI-generated visual elements (like weather effects that match your emotional state) while preserving the authentic moment.\n\n* **AI Memory Journals**: The app creates private, personalized memory collections by recognizing patterns in your daily posts, helping you appreciate the evolution of your routines, relationships, and environments over time.\n\n* **Contextual Prompts**: Unlike BeReal's generic notification, AI analyzes your typical daily patterns and sends notifications during potentially meaningful moments (significant location changes, gatherings with friends, or unusual activities).\n\n* **Friend Insights**: An AI companion analyzes mutual interactions and suggests meaningful ways to engage with friends based on their recent posts, moods, and shared experiences, deepening connections beyond superficial likes.\n\n* **Authentic Reactions**: Replace generic emoji reactions with AI-generated personalized responses that match your speaking style and relationship with each friend, making digital interactions feel more genuine.\n\n## User Experience\n\nlol maintains a minimalist, monochromatic interface with intuitive gestures that emphasize content over UI. The daily notification prompts users to capture their moment within 2 minutes, but the AI-enhanced camera subtly detects emotions and environmental context to add gentle visual enhancements that amplify the mood without filtering reality. Users can toggle between \"Pure Real\" (unenhanced) and \"Feel Real\" (AI-enhanced) modes.\n\nThe social feed shows friends' daily moments with their emotion indicators, and tapping on posts reveals AI-suggested personal responses based on your relationship history. The Memory Journal provides a private space where users can see AI-curated collections of their own moments, organized by emotional patterns, locations, or significant life changes detected over time.\n\n## Technical Implementation\n\nThe app leverages Next.js with React Server Components for the frontend and Vercel Edge Functions for real-time AI processing. The core architecture includes:\n\n1. **Durable Objects** for maintaining stateful chat rooms and user sessions, eliminating the connection issues that plagued BeReal\n2. **OpenRouter integration** for accessing multiple AI models specialized in emotion recognition and content generation\n3. **Upstash Redis** for fast, serverless data storage of user interactions and preferences\n4. **Neon PostgreSQL** for structured data and relationship mapping between users\n5. **Mastra workflow engine** for orchestrating complex AI analysis tasks across multiple services\n\nThe dual-camera capture system uses TensorFlow.js for on-device emotion analysis before sending data to more powerful server-side models for enhancement generation.\n\n## Go-To-Market Strategy\n\nLaunch strategy centers on university campuses with a \"Friend Circles\" approach – users can only join if invited by 3+ existing members, creating trusted networks from the start. The app will leverage the \"2-minute authenticity window\" as a shareable moment, encouraging users to post their lol captures to other platforms with \"This is how I really felt\" messaging.\n\nGrowth will be driven by weekly AI-generated \"Friendship Stories\" that highlight meaningful connections between users and can be shared externally. Partnerships with mental health organizations will position the app as promoting digital well-being through authentic expression rather than performance.\n\n## Resources & Inspiration\n\n* [Reliable UX for AI Chat with Durable Objects](https://sunilpai.dev/posts/reliable-ux-for-ai-chat-with-durable-objects/) – Essential architecture for creating persistent, reliable real-time experiences without the disconnection issues that plagued BeReal.\n\n* [Mastra Workflow Engine](https://github.com/zackees/mastra) – Provides the sophisticated state management needed for complex AI analysis of emotions and social contexts.\n\n* [Priompt](https://github.com/anysphere/priompt) – JSX-based prompt design library perfect for creating the contextual, personalized AI interactions central to the app.\n\n* [Emotion AI in Mobile Apps](https://www.affectiva.com/emotion-ai-overview) – Implementation frameworks for the facial expression recognition that powers the emotional enhancement features.\n\n* [BeReal's Success Factors Analysis](https://www.businessofapps.com/data/bereal-statistics/) – Comprehensive understanding of what worked (and what didn't) in BeReal's approach to authentic social media.\n\n* [Gen Alpha and Gen Z AI Companions](https://www.gartner.com/en/articles/what-gen-z-and-millennials-want-from-generative-ai) – Research on how younger generations interact with AI companions, showing preference for empathetic, playful interactions.\n\n* [Upstash + Next.js Integration](https://github.com/upstash/jstack) – Optimal patterns for building low-cost serverless apps with Redis KV storage and Next.js.",
  "techStack": {
    "frameworks": [
      "next.js",
      "react"
    ],
    "libraries": [
      "tailwindcss",
      "framer-motion",
      "shadcn-ui",
      "react-query"
    ],
    "apis": [
      "restful",
      "graphql"
    ],
    "tools": [
      "typescript",
      "eslint",
      "prisma"
    ],
    "documentationLinks": {
      "next.js": "https://nextjs.org/",
      "react": "https://reactjs.org/",
      "tailwindcss": "https://tailwindcss.com/",
      "framer-motion": "https://www.framer.com/motion/",
      "shadcn-ui": "https://ui.shadcn.com/",
      "react-query": "https://tanstack.com/query/latest",
      "graphql": "https://graphql.org/",
      "restful": "https://restfulapi.net/",
      "typescript": "https://www.typescriptlang.org/",
      "eslint": "https://eslint.org/",
      "prisma": "https://www.prisma.io/"
    }
  },
  "architecture": "# lol: Authentic Moments, Enhanced by AI - Architecture Document\n\n## 1. High-Level System Architecture Overview\n\nThe \"lol\" application is designed as a modern, AI-enhanced social platform that prioritizes authentic interactions while leveraging artificial intelligence to enrich user experiences. The architecture follows a microservices approach with a clear separation of concerns, enabling scalability, maintainability, and resilience.\n\n![High-Level Architecture Diagram](https://mermaid.ink/img/pako:eNqNVMFu2zAM_RWBp7ZAE6dNm16GAVuHAcO2Q7ceuglULcbWIEuGJDfNkH8fZSVOk3bYfLAl8vGRfKQ0QmYlwQSKlVB_pSrRpJrPQTlDvYUfzGizO9pYZ1yLUbQnxW2tLCqjDXrHXWMqNZdO2dJYvBPsm1cGlWTcuXNuLVfCHrjdQcEtXlDJhXLgdMXpQpXIE5ioaFfyOZHmlfDaGfUYx2EYmz2mMNnzCnO0yHMoVMVrVBxAJyVvQOeU9HfnK-yXKOoZlQMbPcbxY5zAZIvPKDSXRtUepFRGT-4rkQvhDfCl0arZgLV9yXiLVbQCGmgdQYMFCo-zRrpF1ihlnwpXZSJiW-WCrVQJE5Fj5XxZnKgpfLsYTmDCcyGUL5bIKFrxktcwEQXwDrXNaXmKRZ-jFBbBZVKKXPDyBaZc1LfKVoKfyYrLaOq5_LpBV5JDlsYdLsNkLUxEYRzZA-Wsd5y7jmH5ByYiN-7Hxbf7p8fvX5fLp_v7L8vl4-PD3fJ-BhNl0YNtlHWZ3yjZWtI_g0mTpGmaNADrOI4u4mQdx0mSxHEaJc04vYjTJr-0-sNyRu_wTZCuWz7Jn0YrXnhw_R7k7LJzWXDXHsJWwmRkdGmVP3Eojm8Oe7UzHnqmj_1vGWxQUlsZbLnDdGBa-lv_ZFVS-tZTD2xRW5UNDKdHdKXRO3YY2Ppz7tpvyDkdCqFLo1UoM2KHvgDyJhSMDt3P1Oj6r-tWXDlbF8NWOXZuRDsYDtbK_1vHQQa7Gg5-FQYdwYT2yP3LwG9-QYo_eLLZCw?type=png)\n\n### Key Architectural Principles:\n\n1. **Serverless-First Approach**: Utilizing serverless technologies to minimize operational overhead and maximize scalability\n2. **Edge Computing**: Leveraging edge functions for low-latency AI processing and content delivery\n3. **AI-Driven Features**: Integrating multiple AI models for emotion recognition, content enhancement, and personalized interactions\n4. **Real-Time Communication**: Enabling seamless, persistent user interactions through durable objects and WebSockets\n5. **Privacy-Centric Design**: Processing sensitive data on-device when possible and implementing strict data governance\n6. **Extensible Platform**: Building a modular system that can easily incorporate new AI capabilities as they emerge\n\n## 2. Component Breakdown and Responsibilities\n\n### 2.1 Frontend Layer\n\n#### Next.js Application with React Server Components\n- **Responsibilities**: \n  - Deliver responsive, accessible UI across devices\n  - Handle client-side and server-side rendering\n  - Manage application state and user interactions\n  - Implement camera access and media capture\n  - Process real-time updates from backend services\n\n#### Key Components:\n- **Authentication Module**: Handles user registration, login, and session management\n- **Capture Interface**: Manages dual-camera access, preview, and capture functionality\n- **Feed Component**: Renders friend posts with AI-enhanced elements and interaction options\n- **Memory Journal**: Displays AI-curated collections of user's past moments\n- **Friend Insights**: Shows AI-generated connection suggestions and relationship insights\n- **Settings Panel**: Provides user preference management and privacy controls\n\n### 2.2 Backend Services\n\n#### User Service (Vercel Serverless Functions + Prisma + Neon PostgreSQL)\n- **Responsibilities**:\n  - Manage user profiles, relationships, and preferences\n  - Handle authentication and authorization\n  - Process friend requests and social connections\n  - Store and retrieve user activity metadata\n\n#### Content Service (Vercel Edge Functions + Upstash Redis + R2 Storage)\n- **Responsibilities**:\n  - Process and store media uploads\n  - Manage content distribution and access control\n  - Handle content moderation and filtering\n  - Implement content recommendation algorithms\n  - Cache frequently accessed content\n\n#### AI Processing Service (Vercel Edge Functions + OpenRouter)\n- **Responsibilities**:\n  - Coordinate emotion recognition processing\n  - Generate visual enhancements based on emotional context\n  - Create personalized interaction suggestions\n  - Analyze patterns in user content for Memory Journals\n  - Route requests to appropriate specialized AI models\n\n#### Real-Time Communication Service (Cloudflare Durable Objects + WebSockets)\n- **Responsibilities**:\n  - Maintain persistent connections for real-time updates\n  - Manage notification delivery\n  - Handle live interactions between users\n  - Ensure reliable message delivery and ordering\n\n#### Workflow Orchestration Service (Mastra Workflow Engine)\n- **Responsibilities**:\n  - Coordinate complex multi-step AI processing tasks\n  - Manage state for long-running operations\n  - Handle retry logic and error recovery\n  - Provide observability into processing pipelines\n\n### 2.3 AI Subsystems\n\n#### Emotion Recognition System (TensorFlow.js + Custom Models)\n- **Responsibilities**:\n  - Analyze facial expressions in captured media\n  - Detect environmental context and mood indicators\n  - Classify emotional states and confidence levels\n  - Provide on-device processing for privacy-sensitive data\n\n#### Visual Enhancement Engine (Custom Generative Models)\n- **Responsibilities**:\n  - Generate subtle visual elements based on emotional context\n  - Apply appropriate style transfers that preserve authenticity\n  - Create consistent visual language for emotional expressions\n  - Ensure enhancements complement rather than obscure original content\n\n#### Social Context Analyzer (Large Language Models)\n- **Responsibilities**:\n  - Analyze relationship patterns between users\n  - Generate personalized interaction suggestions\n  - Create meaningful memory collections\n  - Identify potentially significant moments for notifications\n\n## 3. Data Flow Diagrams and Descriptions\n\n### 3.1 Capture Flow\n\n![Capture Flow](https://mermaid.ink/img/pako:eNqVVE1v2zAM_SuETm2BJE7TtL0MGLYdBgzbDt16ECVQsRhbgyQZktwkQ_57KTtx2qTFsINNkY-PfI8UJ8hNRjCBfC3UX6lyNLnmc1DW0G7pD9PatLc21llbYxTtUXFTKoPK6Ba9485YpebSKlMYh3eC_fTKopKMO3vJreVK2AO3OyiYwysquZAWrCk5XagCeQITFe0LPifSvBLOfRPHYRibPaYw2fMSc3TIcyhUyWtUHEBHJW9A55T0d-dL7Jco6hmVBxs9xvFjnMBkiy8oNJdGlR6kVFpP7iqRC-EN8KXRqtmAtX3JeItVtAQaaB1Bg0cUHmeNdIusUco8Fa7KRMRWZYKtVAETkWPpfFmcqCl8vxpOYMJzIZQvlsgoWvKC1zARBfAOtc1oeYpFn6MUFsFlUopc8OIVplzUd8qUgp_JiotoqrnyG7QuI4csjesuDJO1MBGFdWQPlLPecW47huUfmIjcuh8XX--fHr9_WSye7u-_LBaPjw93i_sZTJRBD7ZRxmZ-o2RrSf8MJk2SNE2SBmAdx9FFnKzjOEmSOI2SZpxexGmTX1r9YTmjd_gqSNctH-TPoxEvPLj-DHJ22bksuGsP4VbCZGR0YZQ_cSiObw57tTMeeqaP_W8ZbFBSWxlsucN0YFr6W_9kVVL61lMPbFFblQ0Mp0d0pdE7dhjY-nPu2m_IOR0KoQujVSgzYoe-APImFIwO3c_U6Pqv61ZcWVMVw1Y5dm5EOxgO1sr_W8dBBrsaDn4VBh3BhPbI_cvAb35Bii-4jNhF?type=png)\n\n1. **User Receives Notification**: The app sends a contextual notification based on user patterns and potential meaningful moments.\n2. **Camera Activation**: User opens the app and activates the dual-camera system within the 2-minute window.\n3. **On-Device Emotion Analysis**: TensorFlow.js performs initial facial expression and context analysis directly on the device.\n4. **Capture Processing**:\n   - Raw images are temporarily stored\n   - Emotion data is sent to the AI Processing Service\n   - Visual enhancement options are generated based on emotional context\n5. **User Selection**: User toggles between \"Pure Real\" (unenhanced) and \"Feel Real\" (AI-enhanced) modes.\n6. **Content Storage**: Selected content is encrypted and stored in R2 Storage.\n7. **Feed Update**: Content becomes available in friends' feeds with appropriate emotional indicators.\n\n### 3.2 Social Interaction Flow\n\n![Social Interaction Flow](https://mermaid.ink/img/pako:eNqVVMFu2zAM_RWCp7ZAEqdpml4GDFsPBYZth3Y9CBKoWIytQZIMSW6SIf8-yk7sNGmx7WBT5OMj3yPFCTJTEEwgXQn1V6oCTanZHJQ1dLf0h2lt2jsbG2xbYhTtUXFTK4PKmBa9485YpebSKpMbh3eCffPKopKMO3vJreVK2AO3OyiYwysquZAWrKk4XagcWQITFe1zNifSvBLOfRPHYRibPaYw2fMKU3TIMyh0xUtUHEBHJW9A55T0d-cr7Jco6hmVBxs9xvFjnMBkiy8oNJdGlR6k1EZP7iqRC-EN8KXRqtmAtX3JeItVtAIaaB1Bg0cUHmeNdIusUco8Fa7KRMRWZYKtVAETkWPlfFmcqCl8vxpOYMJSIZQvlsgoWvKcFTAROfAOtc1oeYpFn6MUFsFlUopc8PwVplzUd8rkgp_JiotoqrnyG7QuI4csjesuDJO1MBGFdWQPlLPecW47hsUfmIjU2h8XX--fHr9_WSye7u-_LBaPjw93i_sZTJRBD7ZRxmZ-o2RrSf8MJk2SNE2SBmAdx9FFnKzjOEmSOI2SZpxexGmTX1r9YTmjd_gqSNctH-TPoxEvPLj-DHJ22bksuGsP4VbCZGR0bpQ_cSiObw57tTMeeqaP_W8ZbFBSWxlsucN0YFr6W_9kVVL61lMPbFFblQ0Mp0d0pdE7dhjY-nPu2m_IOR0KoXOjVSgzYoe-APImFIwO3c_U6Pqv61ZcWVPnw1Y5dm5EOxgO1sr_W8dBBrsaDn4VBh3BhPbI_cvAb35Bii-eZNi9?type=png)\n\n1. **Content Viewing**: User browses their feed and views a friend's post.\n2. **Context Analysis**: AI Processing Service analyzes the relationship context and post content.\n3. **Reaction Generation**: System generates personalized reaction options based on:\n   - User's communication style\n   - Relationship history with the friend\n   - Content context and emotional tone\n4. **User Interaction**: User selects or customizes a reaction.\n5. **Notification Delivery**: Friend receives a real-time notification via Durable Objects.\n6. **Relationship Update**: The interaction is recorded to enhance future AI-generated insights.\n\n### 3.3 Memory Journal Generation Flow\n\n![Memory Journal Flow](https://mermaid.ink/img/pako:eNqNVE1v2zAM_SuETu2AJE7TNL0MGLYeBgzbDt16ECVQsRhbgyQZktwkQ_57KTtx2qTFsINNkY-PfI8UJ8hNQTCBdCXUX6kKNKVmc1DW0N3SH6a16d7Z2GBbiVG0R8VNrQwqY1r0jjtjlZpLq0xuHN4J9s0ri0oy7uwlt5YrYQ_c7qBgDq-o5EJasKbidKFyZAlMVLTP2ZxI80o4900ch2Fs9pjCZM8rTNEhz6DQFa9QcQAdlbwBnVPS352vsF-iqGdUHmz0GMePcQKTLb6g0FwaVXqQUhs9uatELoQ3wJdGq2YD1vYl4y1W0QpooDUEDR5ReJw10i2yRinzVLgqExFblQm2UgVMRI6V82VxoqbwfTWcwISlQihfLJFRtOQ5K2AicuAdapvR8hSLPkcpLILLpBS54PkrTLmo75TJBT-TFRfRVHPlN2hdRg5ZGtddG",
  "features": "# lol: Authentic Moments, Enhanced by AI - Features Document\n\n## Executive Summary\n\n\"lol\" is a next-generation social application that combines authentic social interactions with AI enhancement. Building on the authenticity movement pioneered by BeReal, lol introduces intelligent features that enhance genuine social connections rather than replacing them. The app maintains the core \"2-minute window\" for posting unfiltered content while using AI to help users express themselves, analyze emotional contexts, and create meaningful interactions with friends.\n\nThis document outlines the feature set, priorities, and implementation roadmap for the lol application, targeting Gen Z and Alpha users (16-25) who desire authentic social connections enhanced by thoughtful AI integration.\n\n---\n\n## 1. Feature Breakdown with Priorities\n\n### 1.1 Core Features (P0)\n\n| Feature ID | Feature Name | Description | Priority |\n|------------|--------------|-------------|----------|\n| F1 | Dual-Camera Capture | Simultaneous front and back camera capture within a 2-minute window | P0 |\n| F2 | Emotion-Enhanced Photos | AI analysis of facial expressions with subtle visual enhancements | P0 |\n| F3 | Pure/Feel Real Toggle | Switch between unfiltered and AI-enhanced versions of captured moments | P0 |\n| F4 | Friend Feed | Chronological display of friends' authentic moments | P0 |\n| F5 | Contextual Notifications | AI-driven alerts for potentially meaningful moments to capture | P0 |\n\n### 1.2 Social Enhancement Features (P1)\n\n| Feature ID | Feature Name | Description | Priority |\n|------------|--------------|-------------|----------|\n| F6 | AI Memory Journals | Private, personalized collections of patterns in daily posts | P1 |\n| F7 | Friend Insights | AI analysis suggesting meaningful ways to engage with friends | P1 |\n| F8 | Authentic Reactions | Personalized AI-generated responses matching user speaking style | P1 |\n| F9 | Friendship Stories | Weekly AI-generated highlights of meaningful connections | P1 |\n\n### 1.3 Platform & Growth Features (P2)\n\n| Feature ID | Feature Name | Description | Priority |\n|------------|--------------|-------------|----------|\n| F10 | Friend Circles Invitation | Join system requiring 3+ existing member invitations | P2 |\n| F11 | External Sharing | Share lol captures to other platforms with custom messaging | P2 |\n| F12 | Well-being Insights | Personal patterns and emotional trends over time | P2 |\n| F13 | Community Challenges | Time-limited authentic moment challenges | P2 |\n\n---\n\n## 2. User Stories\n\n### 2.1 Core Capture Experience\n\n**As a user, I want to...**\n\n- Receive a notification at a meaningful moment so I can capture what I'm truly experiencing\n- Capture both my facial expression and my surroundings simultaneously to share my complete experience\n- See subtle AI enhancements that amplify my emotional state without distorting reality\n- Toggle between the original and enhanced versions of my captures to maintain control over authenticity\n- Have a simple, intuitive interface that emphasizes content over UI elements\n\n### 2.2 Social Connection\n\n**As a user, I want to...**\n\n- View my friends' authentic moments in a chronological feed to stay connected with their real lives\n- React to friends' posts with personalized responses that reflect our unique relationship\n- Receive suggestions for meaningful ways to engage with friends based on their recent posts and moods\n- Share my authentic moments externally when I choose to, with messaging that emphasizes the genuine nature of the content\n- Join the platform through trusted friends to ensure my social circle is authentic from the start\n\n### 2.3 Personal Insights\n\n**As a user, I want to...**\n\n- Access a private journal of my own moments organized by emotional patterns or significant changes\n- Receive insights about my daily patterns and how they evolve over time\n- Understand the emotional context of my social interactions to improve my well-being\n- See weekly highlights of meaningful connections with friends to appreciate my relationships\n\n---\n\n## 3. Detailed Feature Specifications\n\n### 3.1 Emotion-Enhanced Captures (F2)\n\n**Description:**  \nThe dual-camera system analyzes facial expressions and environmental context in real-time, subtly enhancing the mood of photos through AI-generated visual elements while preserving the authentic moment.\n\n**Acceptance Criteria:**\n- System accurately detects at least 7 core emotions (joy, sadness, anger, fear, surprise, disgust, contempt)\n- Visual enhancements are subtle and complement the mood (e.g., light effects, slight color adjustments)\n- Processing completes within 3 seconds of capture\n- Original unenhanced version is always preserved and accessible\n- User can toggle between enhanced and original versions\n- Enhancement elements are consistent with user's visual preferences\n\n**Technical Dependencies:**\n- TensorFlow.js for on-device emotion analysis\n- Server-side AI models for enhancement generation\n- Dual-camera API integration\n- Image processing pipeline\n\n### 3.2 AI Memory Journals (F6)\n\n**Description:**  \nThe app creates private, personalized memory collections by recognizing patterns in daily posts, helping users appreciate the evolution of their routines, relationships, and environments over time.\n\n**Acceptance Criteria:**\n- System identifies at least 5 categories of patterns (locations, activities, people, emotions, time patterns)\n- Memory collections update within 1 hour of new content being posted\n- Users can access collections organized by pattern type\n- Journal entries include original images and AI-detected patterns\n- Privacy controls allow users to delete or hide specific memories\n- AI generates insightful captions for detected patterns\n\n**Technical Dependencies:**\n- Pattern recognition AI models\n- Secure private storage for personal data\n- Image and metadata analysis pipeline\n- Natural language generation for insights\n\n### 3.3 Contextual Notifications (F5)\n\n**Description:**  \nAI analyzes typical daily patterns and sends notifications during potentially meaningful moments (significant location changes, gatherings with friends, or unusual activities).\n\n**Acceptance Criteria:**\n- System learns user patterns within 7 days of regular app use\n- Notifications are sent at varying times based on detected meaningful moments\n- Users receive between 1-3 notifications per day\n- Notification timing avoids user's detected \"busy periods\"\n- Users can customize notification preferences\n- System detects at least 3 types of meaningful moments (location changes, social gatherings, unusual activities)\n\n**Technical Dependencies:**\n- Pattern recognition for user behavior\n- Location services integration\n- Push notification system\n- User preference management\n- Activity detection algorithms\n\n### 3.4 Friend Insights (F7)\n\n**Description:**  \nAn AI companion analyzes mutual interactions and suggests meaningful ways to engage with friends based on their recent posts, moods, and shared experiences, deepening connections beyond superficial likes.\n\n**Acceptance Criteria:**\n- System generates at least 3 personalized engagement suggestions per friend weekly\n- Suggestions reflect recent posts and detected emotional states\n- Users can access friend insights directly from friend profiles\n- Suggestions include references to shared experiences or interests\n- Privacy controls allow friends to opt out of having insights generated about them\n- System avoids suggesting engagement during detected sensitive emotional states\n\n**Technical Dependencies:**\n- Relationship mapping algorithms\n- Sentiment analysis of posts and interactions\n- Natural language generation for suggestions\n- Privacy management system\n\n### 3.5 Authentic Reactions (F8)\n\n**Description:**  \nReplace generic emoji reactions with AI-generated personalized responses that match the user's speaking style and relationship with each friend, making digital interactions feel more genuine.\n\n**Acceptance Criteria:**\n- System learns user's communication style within 10 interactions\n- Generated reactions match user's typical vocabulary, tone, and expression patterns\n- Users can select from 3-5 suggested reactions or create their own\n- Reactions are appropriate to the emotional context of the post\n- Users can edit suggested reactions before sending\n- System avoids inappropriate or insensitive suggestions\n\n**Technical Dependencies:**\n- Natural language processing for style analysis\n- Personalized language generation models\n- Context-aware suggestion filtering\n- User feedback integration for improved suggestions\n\n---\n\n## 4. Technical Dependencies and Requirements\n\n### 4.1 Frontend Requirements\n\n- **Next.js with React Server Components**: For efficient rendering and component isolation\n- **TensorFlow.js**: For on-device emotion analysis\n- **WebRTC**: For dual-camera capture\n- **Progressive Web App capabilities**: For native-like experience\n- **Offline support**: For capture during connectivity issues\n- **Responsive design**: Supporting various mobile device dimensions\n\n### 4.2 Backend Requirements\n\n- **Vercel Edge Functions**: For low-latency AI processing\n- **Durable Objects**: For maintaining stateful chat rooms and user sessions\n- **OpenRouter integration**: For accessing multiple specialized AI models\n- **Upstash Redis**: For fast, serverless data storage\n- **Neon PostgreSQL**: For structured data and relationship mapping\n- **Mastra workflow engine**: For orchestrating complex AI analysis tasks\n\n### 4.3 AI and Machine Learning Requirements\n\n- **Emotion recognition models**: For detecting facial expressions and sentiment\n- **Visual enhancement algorithms**: For subtle mood-based photo enhancements\n- **Pattern recognition**: For identifying user behavior patterns\n- **Natural language generation**: For personalized reactions and insights\n- **Relationship mapping**: For understanding social connections\n- **Content safety filters**: For ensuring appropriate AI-generated content\n\n### 4.4 Security and Privacy Requirements\n\n- **On-device processing**: For sensitive data when possible\n- **End-to-end encryption**: For user communications\n- **Data minimization**: Collecting only necessary information\n- **User consent management**: For AI feature opt-in/out\n- **GDPR and CCPA compliance**: For data protection regulations\n- **Age verification**: To ensure compliance with youth protection laws\n\n---\n\n## 5. Implementation Phases\n\n### 5.1 Phase 1: Core Experience (Months 1-3)\n\n**Objectives:**\n- Establish the fundamental authentic capture experience\n- Implement basic AI emotion recognition\n- Create the minimal viable social feed\n\n**Features to Implement:**\n- F1: Dual-Camera Capture\n- F2: Emotion-Enhanced Photos (basic version)\n- F3: Pure/Feel Real Toggle\n- F4: Friend Feed (basic version)\n- F5: Contextual Notifications (time-based only)\n\n**Milestones:**\n- Week 4: Technical architecture finalized\n- Week 8: Dual-camera capture working on major devices\n- Week 10: Basic emotion recognition integrated\n- Week 12: Alpha testing with internal users\n\n### 5.2 Phase 2: Social Enhancement (Months 4-6)\n\n**Objectives:**\n- Deepen the social experience with AI enhancements\n- Improve emotion recognition accuracy\n- Introduce personalized interactions\n\n**Features to Implement:**\n- F5: Contextual Notifications (full version)\n- F7: Friend Insights\n- F8: Authentic Reactions\n- F10: Friend Circles Invitation\n\n**Milestones:**\n- Week 16: Enhanced emotion recognition with 90%+ accuracy\n- Week 20: Friend insights generation working\n- Week 22: Authentic reactions system deployed\n- Week 24: Beta testing with expanded user group\n\n### 5.3 Phase 3: Personal Growth (Months 7-9)\n\n**Objectives:**\n- Introduce personal reflection features\n- Enhance pattern recognition capabilities\n- Implement sharing mechanisms\n\n**Features to Implement:**\n- F6: AI Memory Journals\n- F9: Friendship Stories\n- F11: External Sharing\n- F12: Well-being Insights\n\n**Milestones:**\n- Week 28: Memory journal pattern detection working\n- Week 32: Friendship stories generation implemented\n- Week 36: Public beta launch with invitation system\n\n### 5.4 Phase 4: Community Building (Months 10-12)\n\n**Objectives:**\n- Scale the platform to wider audience\n- Implement community features\n- Optimize performance and reliability\n\n**Features to Implement:**\n- F13: Community Challenges\n- Performance optimizations\n- Extended platform compatibility\n- Enhanced AI capabilities\n\n**Milestones:**\n- Week 40: Community challenges framework implemented\n- Week 44: Performance metrics meeting targets (99% uptime, <2s response)\n- Week 48: Full public launch\n- Week 52: One million user milestone\n\n---\n\n## 6. Acceptance Criteria Overview\n\nFor a feature to be considered complete and ready for release, it must meet the following general criteria in addition to the specific criteria listed for each feature:\n\n1. **Functionality**: Feature works as specified across all supported devices and platforms\n2. **Performance**: Feature performs within defined latency and resource utilization parameters\n3. **Reliability**: Feature maintains 99.9% uptime and handles edge cases gracefully\n4. **Security**: Feature adheres to all security and privacy requirements\n5. **Usability**: Feature passes user testing with at least 80% satisfaction rating\n6. **Accessibility**: Feature meets WCAG 2.1 AA standards\n7. **Internationalization**: Feature supports localization for target markets\n8. **Analytics**: Feature includes appropriate tracking to measure engagement and performance\n\n---\n\n## 7. Risk Assessment and Mitigation\n\n| Risk | Impact | Probability | Mitigation |\n|------|--------|------------|------------|\n| AI emotion detection accuracy issues | High | Medium | Extensive training with diverse dataset; fallback to basic enhancements; user feedback loop |\n| User privacy concerns | High | Medium | On-device processing where possible; clear consent flows; granular privacy controls; transparent data policies |\n| Technical performance on older devices | Medium | High | Progressive enhancement approach; device-specific optimizations; reduced feature set for low-end devices |\n| AI-generated content appropriateness | High | Low | Content safety filters; human review for edge cases; user reporting system; continuous model training |\n| User adoption challenges | High | Medium | Friend circle invitation system; campus-focused launch strategy; authentic marketing approach; influencer partnerships |\n| Regulatory compliance issues | High | Low | Regular legal reviews; privacy-by-design approach; age verification; clear terms of service |\n\n---\n\nThis features document provides a comprehensive roadmap for the development of the \"lol\" application, focusing on creating an authentic social experience enhanced by thoughtful AI integration. The phased implementation approach allows for iterative development and testing, ensuring that each feature meets quality standards before moving to the next phase.",
  "content": {
    "overview": [
      "AI-enhanced authentic social moments within 2-minute windows",
      "Emotion recognition with subtle visual enhancements",
      "Private AI memory journals tracking personal patterns",
      "Contextual notifications for meaningful moment capture"
    ],
    "core": [
      "Dual-camera emotion-enhanced photo capture",
      "Friend insights for deeper social connections",
      "Personalized AI reactions matching user relationships",
      "Toggle between Pure Real and Feel Real modes"
    ],
    "architecture": [
      "Next.js with React Server Components",
      "Vercel Edge Functions for real-time AI processing",
      "Durable Objects for persistent chat sessions",
      "TensorFlow.js for on-device emotion analysis"
    ],
    "tech": [
      {
        "name": "Next.js",
        "documentationUrl": "https://nextjs.org/"
      },
      {
        "name": "React",
        "documentationUrl": "https://reactjs.org/"
      },
      {
        "name": "TailwindCSS",
        "documentationUrl": "https://tailwindcss.com/"
      },
      {
        "name": "Framer Motion",
        "documentationUrl": "https://www.framer.com/motion/"
      },
      {
        "name": "shadcn/ui",
        "documentationUrl": "https://ui.shadcn.com/"
      },
      {
        "name": "React Query",
        "documentationUrl": "https://tanstack.com/query/latest"
      },
      {
        "name": "GraphQL",
        "documentationUrl": "https://graphql.org/"
      },
      {
        "name": "RESTful API",
        "documentationUrl": "https://restfulapi.net/"
      },
      {
        "name": "TypeScript",
        "documentationUrl": "https://www.typescriptlang.org/"
      },
      {
        "name": "ESLint",
        "documentationUrl": "https://eslint.org/"
      },
      {
        "name": "Prisma",
        "documentationUrl": "https://www.prisma.io/"
      }
    ]
  },
  "research": ""
}
Formatted projectContent structure: {
  "overview": [],
  "core": [],
  "architecture": [
    "# lol: Authentic Moments, Enhanced by AI - Architecture Document\n\n## 1. High-Level System Architecture Overview\n\nThe \"lol\" application is designed as a modern, AI-enhanced social platform that prioritizes authentic interactions while leveraging artificial intelligence to enrich user experiences. The architecture follows a microservices approach with a clear separation of concerns, enabling scalability, maintainability, and resilience.\n\n![High-Level Architecture Diagram](https://mermaid.ink/img/pako:eNqNVMFu2zAM_RWBp7ZAE6dNm16GAVuHAcO2Q7ceuglULcbWIEuGJDfNkH8fZSVOk3bYfLAl8vGRfKQ0QmYlwQSKlVB_pSrRpJrPQTlDvYUfzGizO9pYZ1yLUbQnxW2tLCqjDXrHXWMqNZdO2dJYvBPsm1cGlWTcuXNuLVfCHrjdQcEtXlDJhXLgdMXpQpXIE5ioaFfyOZHmlfDaGfUYx2EYmz2mMNnzCnO0yHMoVMVrVBxAJyVvQOeU9HfnK-yXKOoZlQMbPcbxY5zAZIvPKDSXRtUepFRGT-4rkQvhDfCl0arZgLV9yXiLVbQCGmgdQYMFCo-zRrpF1ihlnwpXZSJiW-WCrVQJE5Fj5XxZnKgpfLsYTmDCcyGUL5bIKFrxktcwEQXwDrXNaXmKRZ-jFBbBZVKKXPDyBaZc1LfKVoKfyYrLaOq5_LpBV5JDlsYdLsNkLUxEYRzZA-Wsd5y7jmH5ByYiN-7Hxbf7p8fvX5fLp_v7L8vl4-PD3fJ-BhNl0YNtlHWZ3yjZWtI_g0mTpGmaNADrOI4u4mQdx0mSxHEaJc04vYjTJr-0-sNyRu_wTZCuWz7Jn0YrXnhw_R7k7LJzWXDXHsJWwmRkdGmVP3Eojm8Oe7UzHnqmj_1vGWxQUlsZbLnDdGBa-lv_ZFVS-tZTD2xRW5UNDKdHdKXRO3YY2Ppz7tpvyDkdCqFLo1UoM2KHvgDyJhSMDt3P1Oj6r-tWXDlbF8NWOXZuRDsYDtbK_1vHQQa7Gg5-FQYdwYT2yP3LwG9-QYo_eLLZCw?type=png)\n\n### Key Architectural Principles:\n\n1. **Serverless-First Approach**: Utilizing serverless technologies to minimize operational overhead and maximize scalability\n2. **Edge Computing**: Leveraging edge functions for low-latency AI processing and content delivery\n3. **AI-Driven Features**: Integrating multiple AI models for emotion recognition, content enhancement, and personalized interactions\n4. **Real-Time Communication**: Enabling seamless, persistent user interactions through durable objects and WebSockets\n5. **Privacy-Centric Design**: Processing sensitive data on-device when possible and implementing strict data governance\n6. **Extensible Platform**: Building a modular system that can easily incorporate new AI capabilities as they emerge\n\n## 2. Component Breakdown and Responsibilities\n\n### 2.1 Frontend Layer\n\n#### Next.js Application with React Server Components\n- **Responsibilities**: \n  - Deliver responsive, accessible UI across devices\n  - Handle client-side and server-side rendering\n  - Manage application state and user interactions\n  - Implement camera access and media capture\n  - Process real-time updates from backend services\n\n#### Key Components:\n- **Authentication Module**: Handles user registration, login, and session management\n- **Capture Interface**: Manages dual-camera access, preview, and capture functionality\n- **Feed Component**: Renders friend posts with AI-enhanced elements and interaction options\n- **Memory Journal**: Displays AI-curated collections of user's past moments\n- **Friend Insights**: Shows AI-generated connection suggestions and relationship insights\n- **Settings Panel**: Provides user preference management and privacy controls\n\n### 2.2 Backend Services\n\n#### User Service (Vercel Serverless Functions + Prisma + Neon PostgreSQL)\n- **Responsibilities**:\n  - Manage user profiles, relationships, and preferences\n  - Handle authentication and authorization\n  - Process friend requests and social connections\n  - Store and retrieve user activity metadata\n\n#### Content Service (Vercel Edge Functions + Upstash Redis + R2 Storage)\n- **Responsibilities**:\n  - Process and store media uploads\n  - Manage content distribution and access control\n  - Handle content moderation and filtering\n  - Implement content recommendation algorithms\n  - Cache frequently accessed content\n\n#### AI Processing Service (Vercel Edge Functions + OpenRouter)\n- **Responsibilities**:\n  - Coordinate emotion recognition processing\n  - Generate visual enhancements based on emotional context\n  - Create personalized interaction suggestions\n  - Analyze patterns in user content for Memory Journals\n  - Route requests to appropriate specialized AI models\n\n#### Real-Time Communication Service (Cloudflare Durable Objects + WebSockets)\n- **Responsibilities**:\n  - Maintain persistent connections for real-time updates\n  - Manage notification delivery\n  - Handle live interactions between users\n  - Ensure reliable message delivery and ordering\n\n#### Workflow Orchestration Service (Mastra Workflow Engine)\n- **Responsibilities**:\n  - Coordinate complex multi-step AI processing tasks\n  - Manage state for long-running operations\n  - Handle retry logic and error recovery\n  - Provide observability into processing pipelines\n\n### 2.3 AI Subsystems\n\n#### Emotion Recognition System (TensorFlow.js + Custom Models)\n- **Responsibilities**:\n  - Analyze facial expressions in captured media\n  - Detect environmental context and mood indicators\n  - Classify emotional states and confidence levels\n  - Provide on-device processing for privacy-sensitive data\n\n#### Visual Enhancement Engine (Custom Generative Models)\n- **Responsibilities**:\n  - Generate subtle visual elements based on emotional context\n  - Apply appropriate style transfers that preserve authenticity\n  - Create consistent visual language for emotional expressions\n  - Ensure enhancements complement rather than obscure original content\n\n#### Social Context Analyzer (Large Language Models)\n- **Responsibilities**:\n  - Analyze relationship patterns between users\n  - Generate personalized interaction suggestions\n  - Create meaningful memory collections\n  - Identify potentially significant moments for notifications\n\n## 3. Data Flow Diagrams and Descriptions\n\n### 3.1 Capture Flow\n\n![Capture Flow](https://mermaid.ink/img/pako:eNqVVE1v2zAM_SuETm2BJE7TtL0MGLYdBgzbDt16ECVQsRhbgyQZktwkQ_57KTtx2qTFsINNkY-PfI8UJ8hNRjCBfC3UX6lyNLnmc1DW0G7pD9PatLc21llbYxTtUXFTKoPK6Ba9485YpebSKlMYh3eC_fTKopKMO3vJreVK2AO3OyiYwysquZAWrCk5XagCeQITFe0LPifSvBLOfRPHYRibPaYw2fMSc3TIcyhUyWtUHEBHJW9A55T0d-dL7Jco6hmVBxs9xvFjnMBkiy8oNJdGlR6kVFpP7iqRC-EN8KXRqtmAtX3JeItVtAQaaB1Bg0cUHmeNdIusUco8Fa7KRMRWZYKtVAETkWPpfFmcqCl8vxpOYMJzIZQvlsgoWvKC1zARBfAOtc1oeYpFn6MUFsFlUopc8OIVplzUd8qUgp_JiotoqrnyG7QuI4csjesuDJO1MBGFdWQPlLPecW47huUfmIjcuh8XX--fHr9_WSye7u-_LBaPjw93i_sZTJRBD7ZRxmZ-o2RrSf8MJk2SNE2SBmAdx9FFnKzjOEmSOI2SZpxexGmTX1r9YTmjd_gqSNctH-TPoxEvPLj-DHJ22bksuGsP4VbCZGR0YZQ_cSiObw57tTMeeqaP_W8ZbFBSWxlsucN0YFr6W_9kVVL61lMPbFFblQ0Mp0d0pdE7dhjY-nPu2m_IOR0KoQujVSgzYoe-APImFIwO3c_U6Pqv61ZcWVMVw1Y5dm5EOxgO1sr_W8dBBrsaDn4VBh3BhPbI_cvAb35Bii-4jNhF?type=png)\n\n1. **User Receives Notification**: The app sends a contextual notification based on user patterns and potential meaningful moments.\n2. **Camera Activation**: User opens the app and activates the dual-camera system within the 2-minute window.\n3. **On-Device Emotion Analysis**: TensorFlow.js performs initial facial expression and context analysis directly on the device.\n4. **Capture Processing**:\n   - Raw images are temporarily stored\n   - Emotion data is sent to the AI Processing Service\n   - Visual enhancement options are generated based on emotional context\n5. **User Selection**: User toggles between \"Pure Real\" (unenhanced) and \"Feel Real\" (AI-enhanced) modes.\n6. **Content Storage**: Selected content is encrypted and stored in R2 Storage.\n7. **Feed Update**: Content becomes available in friends' feeds with appropriate emotional indicators.\n\n### 3.2 Social Interaction Flow\n\n![Social Interaction Flow](https://mermaid.ink/img/pako:eNqVVMFu2zAM_RWCp7ZAEqdpml4GDFsPBYZth3Y9CBKoWIytQZIMSW6SIf8-yk7sNGmx7WBT5OMj3yPFCTJTEEwgXQn1V6oCTanZHJQ1dLf0h2lt2jsbG2xbYhTtUXFTK4PKmBa9485YpebSKpMbh3eCffPKopKMO3vJreVK2AO3OyiYwysquZAWrKk4XagcWQITFe1zNifSvBLOfRPHYRibPaYw2fMKU3TIMyh0xUtUHEBHJW9A55T0d-cr7Jco6hmVBxs9xvFjnMBkiy8oNJdGlR6k1EZP7iqRC-EN8KXRqtmAtX3JeItVtAIaaB1Bg0cUHmeNdIusUco8Fa7KRMRWZYKtVAETkWPlfFmcqCl8vxpOYMJSIZQvlsgoWvKcFTAROfAOtc1oeYpFn6MUFsFlUopc8PwVplzUd8rkgp_JiotoqrnyG7QuI4csjesuDJO1MBGFdWQPlLPecW47hsUfmIjU2h8XX--fHr9_WSye7u-_LBaPjw93i_sZTJRBD7ZRxmZ-o2RrSf8MJk2SNE2SBmAdx9FFnKzjOEmSOI2SZpxexGmTX1r9YTmjd_gqSNctH-TPoxEvPLj-DHJ22bksuGsP4VbCZGR0bpQ_cSiObw57tTMeeqaP_W8ZbFBSWxlsucN0YFr6W_9kVVL61lMPbFFblQ0Mp0d0pdE7dhjY-nPu2m_IOR0KoXOjVSgzYoe-APImFIwO3c_U6Pqv61ZcWVPnw1Y5dm5EOxgO1sr_W8dBBrsaDn4VBh3BhPbI_cvAb35Bii-eZNi9?type=png)\n\n1. **Content Viewing**: User browses their feed and views a friend's post.\n2. **Context Analysis**: AI Processing Service analyzes the relationship context and post content.\n3. **Reaction Generation**: System generates personalized reaction options based on:\n   - User's communication style\n   - Relationship history with the friend\n   - Content context and emotional tone\n4. **User Interaction**: User selects or customizes a reaction.\n5. **Notification Delivery**: Friend receives a real-time notification via Durable Objects.\n6. **Relationship Update**: The interaction is recorded to enhance future AI-generated insights.\n\n### 3.3 Memory Journal Generation Flow\n\n![Memory Journal Flow](https://mermaid.ink/img/pako:eNqNVE1v2zAM_SuETu2AJE7TNL0MGLYeBgzbDt16ECVQsRhbgyQZktwkQ_57KTtx2qTFsINNkY-PfI8UJ8hNQTCBdCXUX6kKNKVmc1DW0N3SH6a16d7Z2GBbiVG0R8VNrQwqY1r0jjtjlZpLq0xuHN4J9s0ri0oy7uwlt5YrYQ_c7qBgDq-o5EJasKbidKFyZAlMVLTP2ZxI80o4900ch2Fs9pjCZM8rTNEhz6DQFa9QcQAdlbwBnVPS352vsF-iqGdUHmz0GMePcQKTLb6g0FwaVXqQUhs9uatELoQ3wJdGq2YD1vYl4y1W0QpooDUEDR5ReJw10i2yRinzVLgqExFblQm2UgVMRI6V82VxoqbwfTWcwISlQihfLJFRtOQ5K2AicuAdapvR8hSLPkcpLILLpBS54PkrTLmo75TJBT-TFRfRVHPlN2hdRg5ZGtddG"
  ],
  "tech": []
}
[2025-03-06T09:19:35.880Z] [INFO] [DOCUMENTATION] Generating documentation with:
[2025-03-06T09:19:35.880Z] [INFO] [DOCUMENTATION] Data: {
  "techStack": "{\n  \"frameworks\": [],\n  \"libraries\": [],\n  \"apis\": [],\n  \"tools\": [],\n  \"documentationLinks\": {}\n}",
  "projectContent": "{\n  \"overview\": [],\n  \"core\": [],\n  \"architecture\": [\n    \"# lol: Authentic Moments, Enhanced by AI - Architecture Document\\n\\n## 1. High-Level System Architecture Overview\\n\\nThe \\\"lol\\\" application is designed as a modern, AI-enhanced social platform that prioritizes authentic interactions while leveraging artificial intelligence to enrich user experiences. The architecture follows a microservices approach with a clear separation of concerns, enabling scalability, maintainability, and resilience.\\n\\n![High-Level Architecture Diagram](https://mermaid.ink/img/pako:eNqNVMFu2zAM_RWBp7ZAE6dNm16GAVuHAcO2Q7ceuglULcbWIEuGJDfNkH8fZSVOk3bYfLAl8vGRfKQ0QmYlwQSKlVB_pSrRpJrPQTlDvYUfzGizO9pYZ1yLUbQnxW2tLCqjDXrHXWMqNZdO2dJYvBPsm1cGlWTcuXNuLVfCHrjdQcEtXlDJhXLgdMXpQpXIE5ioaFfyOZHmlfDaGfUYx2EYmz2mMNnzCnO0yHMoVMVrVBxAJyVvQOeU9HfnK-yXKOoZlQMbPcbxY5zAZIvPKDSXRtUepFRGT-4rkQvhDfCl0arZgLV9yXiLVbQCGmgdQYMFCo-zRrpF1ihlnwpXZSJiW-WCrVQJE5Fj5XxZnKgpfLsYTmDCcyGUL5bIKFrxktcwEQXwDrXNaXmKRZ-jFBbBZVKKXPDyBaZc1LfKVoKfyYrLaOq5_LpBV5JDlsYdLsNkLUxEYRzZA-Wsd5y7jmH5ByYiN-7Hxbf7p8fvX5fLp_v7L8vl4-PD3fJ-BhNl0YNtlHWZ3yjZWtI_g0mTpGmaNADrOI4u4mQdx0mSxHEaJc04vYjTJr-0-sNyRu_wTZCuWz7Jn0YrXnhw_R7k7LJzWXDXHsJWwmRkdGmVP3Eojm8Oe7UzHnqmj_1vGWxQUlsZbLnDdGBa-lv_ZFVS-tZTD2xRW5UNDKdHdKXRO3YY2Ppz7tpvyDkdCqFLo1UoM2KHvgDyJhSMDt3P1Oj6r-tWXDlbF8NWOXZuRDsYDtbK_1vHQQa7Gg5-FQYdwYT2yP3LwG9-QYo_eLLZCw?type=png)\\n\\n### Key Architectural Principles:\\n\\n1. **Serverless-First Approach**: Utilizing serverless technologies to minimize operational overhead and maximize scalability\\n2. **Edge Computing**: Leveraging edge functions for low-latency AI processing and content delivery\\n3. **AI-Driven Features**: Integrating multiple AI models for emotion recognition, content enhancement, and personalized interactions\\n4. **Real-Time Communication**: Enabling seam... (truncated, full length: 9862)
[2025-03-06T09:19:35.880Z] [INFO] [DOCUMENTATION] Generating project documentation...
Original projectContent structure: {
  "overview": [],
  "core": [],
  "architecture": [
    "# lol: Authentic Moments, Enhanced by AI - Architecture Document\n\n## 1. High-Level System Architecture Overview\n\nThe \"lol\" application is designed as a modern, AI-enhanced social platform that prioritizes authentic interactions while leveraging artificial intelligence to enrich user experiences. The architecture follows a microservices approach with a clear separation of concerns, enabling scalability, maintainability, and resilience.\n\n![High-Level Architecture Diagram](https://mermaid.ink/img/pako:eNqNVMFu2zAM_RWBp7ZAE6dNm16GAVuHAcO2Q7ceuglULcbWIEuGJDfNkH8fZSVOk3bYfLAl8vGRfKQ0QmYlwQSKlVB_pSrRpJrPQTlDvYUfzGizO9pYZ1yLUbQnxW2tLCqjDXrHXWMqNZdO2dJYvBPsm1cGlWTcuXNuLVfCHrjdQcEtXlDJhXLgdMXpQpXIE5ioaFfyOZHmlfDaGfUYx2EYmz2mMNnzCnO0yHMoVMVrVBxAJyVvQOeU9HfnK-yXKOoZlQMbPcbxY5zAZIvPKDSXRtUepFRGT-4rkQvhDfCl0arZgLV9yXiLVbQCGmgdQYMFCo-zRrpF1ihlnwpXZSJiW-WCrVQJE5Fj5XxZnKgpfLsYTmDCcyGUL5bIKFrxktcwEQXwDrXNaXmKRZ-jFBbBZVKKXPDyBaZc1LfKVoKfyYrLaOq5_LpBV5JDlsYdLsNkLUxEYRzZA-Wsd5y7jmH5ByYiN-7Hxbf7p8fvX5fLp_v7L8vl4-PD3fJ-BhNl0YNtlHWZ3yjZWtI_g0mTpGmaNADrOI4u4mQdx0mSxHEaJc04vYjTJr-0-sNyRu_wTZCuWz7Jn0YrXnhw_R7k7LJzWXDXHsJWwmRkdGmVP3Eojm8Oe7UzHnqmj_1vGWxQUlsZbLnDdGBa-lv_ZFVS-tZTD2xRW5UNDKdHdKXRO3YY2Ppz7tpvyDkdCqFLo1UoM2KHvgDyJhSMDt3P1Oj6r-tWXDlbF8NWOXZuRDsYDtbK_1vHQQa7Gg5-FQYdwYT2yP3LwG9-QYo_eLLZCw?type=png)\n\n### Key Architectural Principles:\n\n1. **Serverless-First Approach**: Utilizing serverless technologies to minimize operational overhead and maximize scalability\n2. **Edge Computing**: Leveraging edge functions for low-latency AI processing and content delivery\n3. **AI-Driven Features**: Integrating multiple AI models for emotion recognition, content enhancement, and personalized interactions\n4. **Real-Time Communication**: Enabling seamless, persistent user interactions through durable objects and WebSockets\n5. **Privacy-Centric Design**: Processing sensitive data on-device when possible and implementing strict data governance\n6. **Extensible Platform**: Building a modular system that can easily incorporate new AI capabilities as they emerge\n\n## 2. Component Breakdown and Responsibilities\n\n### 2.1 Frontend Layer\n\n#### Next.js Application with React Server Components\n- **Responsibilities**: \n  - Deliver responsive, accessible UI across devices\n  - Handle client-side and server-side rendering\n  - Manage application state and user interactions\n  - Implement camera access and media capture\n  - Process real-time updates from backend services\n\n#### Key Components:\n- **Authentication Module**: Handles user registration, login, and session management\n- **Capture Interface**: Manages dual-camera access, preview, and capture functionality\n- **Feed Component**: Renders friend posts with AI-enhanced elements and interaction options\n- **Memory Journal**: Displays AI-curated collections of user's past moments\n- **Friend Insights**: Shows AI-generated connection suggestions and relationship insights\n- **Settings Panel**: Provides user preference management and privacy controls\n\n### 2.2 Backend Services\n\n#### User Service (Vercel Serverless Functions + Prisma + Neon PostgreSQL)\n- **Responsibilities**:\n  - Manage user profiles, relationships, and preferences\n  - Handle authentication and authorization\n  - Process friend requests and social connections\n  - Store and retrieve user activity metadata\n\n#### Content Service (Vercel Edge Functions + Upstash Redis + R2 Storage)\n- **Responsibilities**:\n  - Process and store media uploads\n  - Manage content distribution and access control\n  - Handle content moderation and filtering\n  - Implement content recommendation algorithms\n  - Cache frequently accessed content\n\n#### AI Processing Service (Vercel Edge Functions + OpenRouter)\n- **Responsibilities**:\n  - Coordinate emotion recognition processing\n  - Generate visual enhancements based on emotional context\n  - Create personalized interaction suggestions\n  - Analyze patterns in user content for Memory Journals\n  - Route requests to appropriate specialized AI models\n\n#### Real-Time Communication Service (Cloudflare Durable Objects + WebSockets)\n- **Responsibilities**:\n  - Maintain persistent connections for real-time updates\n  - Manage notification delivery\n  - Handle live interactions between users\n  - Ensure reliable message delivery and ordering\n\n#### Workflow Orchestration Service (Mastra Workflow Engine)\n- **Responsibilities**:\n  - Coordinate complex multi-step AI processing tasks\n  - Manage state for long-running operations\n  - Handle retry logic and error recovery\n  - Provide observability into processing pipelines\n\n### 2.3 AI Subsystems\n\n#### Emotion Recognition System (TensorFlow.js + Custom Models)\n- **Responsibilities**:\n  - Analyze facial expressions in captured media\n  - Detect environmental context and mood indicators\n  - Classify emotional states and confidence levels\n  - Provide on-device processing for privacy-sensitive data\n\n#### Visual Enhancement Engine (Custom Generative Models)\n- **Responsibilities**:\n  - Generate subtle visual elements based on emotional context\n  - Apply appropriate style transfers that preserve authenticity\n  - Create consistent visual language for emotional expressions\n  - Ensure enhancements complement rather than obscure original content\n\n#### Social Context Analyzer (Large Language Models)\n- **Responsibilities**:\n  - Analyze relationship patterns between users\n  - Generate personalized interaction suggestions\n  - Create meaningful memory collections\n  - Identify potentially significant moments for notifications\n\n## 3. Data Flow Diagrams and Descriptions\n\n### 3.1 Capture Flow\n\n![Capture Flow](https://mermaid.ink/img/pako:eNqVVE1v2zAM_SuETm2BJE7TtL0MGLYdBgzbDt16ECVQsRhbgyQZktwkQ_57KTtx2qTFsINNkY-PfI8UJ8hNRjCBfC3UX6lyNLnmc1DW0G7pD9PatLc21llbYxTtUXFTKoPK6Ba9485YpebSKlMYh3eC_fTKopKMO3vJreVK2AO3OyiYwysquZAWrCk5XagCeQITFe0LPifSvBLOfRPHYRibPaYw2fMSc3TIcyhUyWtUHEBHJW9A55T0d-dL7Jco6hmVBxs9xvFjnMBkiy8oNJdGlR6kVFpP7iqRC-EN8KXRqtmAtX3JeItVtAQaaB1Bg0cUHmeNdIusUco8Fa7KRMRWZYKtVAETkWPpfFmcqCl8vxpOYMJzIZQvlsgoWvKC1zARBfAOtc1oeYpFn6MUFsFlUopc8OIVplzUd8qUgp_JiotoqrnyG7QuI4csjesuDJO1MBGFdWQPlLPecW47huUfmIjcuh8XX--fHr9_WSye7u-_LBaPjw93i_sZTJRBD7ZRxmZ-o2RrSf8MJk2SNE2SBmAdx9FFnKzjOEmSOI2SZpxexGmTX1r9YTmjd_gqSNctH-TPoxEvPLj-DHJ22bksuGsP4VbCZGR0YZQ_cSiObw57tTMeeqaP_W8ZbFBSWxlsucN0YFr6W_9kVVL61lMPbFFblQ0Mp0d0pdE7dhjY-nPu2m_IOR0KoQujVSgzYoe-APImFIwO3c_U6Pqv61ZcWVMVw1Y5dm5EOxgO1sr_W8dBBrsaDn4VBh3BhPbI_cvAb35Bii-4jNhF?type=png)\n\n1. **User Receives Notification**: The app sends a contextual notification based on user patterns and potential meaningful moments.\n2. **Camera Activation**: User opens the app and activates the dual-camera system within the 2-minute window.\n3. **On-Device Emotion Analysis**: TensorFlow.js performs initial facial expression and context analysis directly on the device.\n4. **Capture Processing**:\n   - Raw images are temporarily stored\n   - Emotion data is sent to the AI Processing Service\n   - Visual enhancement options are generated based on emotional context\n5. **User Selection**: User toggles between \"Pure Real\" (unenhanced) and \"Feel Real\" (AI-enhanced) modes.\n6. **Content Storage**: Selected content is encrypted and stored in R2 Storage.\n7. **Feed Update**: Content becomes available in friends' feeds with appropriate emotional indicators.\n\n### 3.2 Social Interaction Flow\n\n![Social Interaction Flow](https://mermaid.ink/img/pako:eNqVVMFu2zAM_RWCp7ZAEqdpml4GDFsPBYZth3Y9CBKoWIytQZIMSW6SIf8-yk7sNGmx7WBT5OMj3yPFCTJTEEwgXQn1V6oCTanZHJQ1dLf0h2lt2jsbG2xbYhTtUXFTK4PKmBa9485YpebSKpMbh3eCffPKopKMO3vJreVK2AO3OyiYwysquZAWrKk4XagcWQITFe1zNifSvBLOfRPHYRibPaYw2fMKU3TIMyh0xUtUHEBHJW9A55T0d-cr7Jco6hmVBxs9xvFjnMBkiy8oNJdGlR6k1EZP7iqRC-EN8KXRqtmAtX3JeItVtAIaaB1Bg0cUHmeNdIusUco8Fa7KRMRWZYKtVAETkWPlfFmcqCl8vxpOYMJSIZQvlsgoWvKcFTAROfAOtc1oeYpFn6MUFsFlUopc8PwVplzUd8rkgp_JiotoqrnyG7QuI4csjesuDJO1MBGFdWQPlLPecW47hsUfmIjU2h8XX--fHr9_WSye7u-_LBaPjw93i_sZTJRBD7ZRxmZ-o2RrSf8MJk2SNE2SBmAdx9FFnKzjOEmSOI2SZpxexGmTX1r9YTmjd_gqSNctH-TPoxEvPLj-DHJ22bksuGsP4VbCZGR0bpQ_cSiObw57tTMeeqaP_W8ZbFBSWxlsucN0YFr6W_9kVVL61lMPbFFblQ0Mp0d0pdE7dhjY-nPu2m_IOR0KoXOjVSgzYoe-APImFIwO3c_U6Pqv61ZcWVPnw1Y5dm5EOxgO1sr_W8dBBrsaDn4VBh3BhPbI_cvAb35Bii-eZNi9?type=png)\n\n1. **Content Viewing**: User browses their feed and views a friend's post.\n2. **Context Analysis**: AI Processing Service analyzes the relationship context and post content.\n3. **Reaction Generation**: System generates personalized reaction options based on:\n   - User's communication style\n   - Relationship history with the friend\n   - Content context and emotional tone\n4. **User Interaction**: User selects or customizes a reaction.\n5. **Notification Delivery**: Friend receives a real-time notification via Durable Objects.\n6. **Relationship Update**: The interaction is recorded to enhance future AI-generated insights.\n\n### 3.3 Memory Journal Generation Flow\n\n![Memory Journal Flow](https://mermaid.ink/img/pako:eNqNVE1v2zAM_SuETu2AJE7TNL0MGLYeBgzbDt16ECVQsRhbgyQZktwkQ_57KTtx2qTFsINNkY-PfI8UJ8hNQTCBdCXUX6kKNKVmc1DW0N3SH6a16d7Z2GBbiVG0R8VNrQwqY1r0jjtjlZpLq0xuHN4J9s0ri0oy7uwlt5YrYQ_c7qBgDq-o5EJasKbidKFyZAlMVLTP2ZxI80o4900ch2Fs9pjCZM8rTNEhz6DQFa9QcQAdlbwBnVPS352vsF-iqGdUHmz0GMePcQKTLb6g0FwaVXqQUhs9uatELoQ3wJdGq2YD1vYl4y1W0QpooDUEDR5ReJw10i2yRinzVLgqExFblQm2UgVMRI6V82VxoqbwfTWcwISlQihfLJFRtOQ5K2AicuAdapvR8hSLPkcpLILLpBS54PkrTLmo75TJBT-TFRfRVHPlN2hdRg5ZGtddG"
  ],
  "tech": []
}
Formatted projectContent structure: {
  "overview": [],
  "core": [],
  "architecture": [
    "# lol: Authentic Moments, Enhanced by AI - Architecture Document\n\n## 1. High-Level System Architecture Overview\n\nThe \"lol\" application is designed as a modern, AI-enhanced social platform that prioritizes authentic interactions while leveraging artificial intelligence to enrich user experiences. The architecture follows a microservices approach with a clear separation of concerns, enabling scalability, maintainability, and resilience.\n\n![High-Level Architecture Diagram](https://mermaid.ink/img/pako:eNqNVMFu2zAM_RWBp7ZAE6dNm16GAVuHAcO2Q7ceuglULcbWIEuGJDfNkH8fZSVOk3bYfLAl8vGRfKQ0QmYlwQSKlVB_pSrRpJrPQTlDvYUfzGizO9pYZ1yLUbQnxW2tLCqjDXrHXWMqNZdO2dJYvBPsm1cGlWTcuXNuLVfCHrjdQcEtXlDJhXLgdMXpQpXIE5ioaFfyOZHmlfDaGfUYx2EYmz2mMNnzCnO0yHMoVMVrVBxAJyVvQOeU9HfnK-yXKOoZlQMbPcbxY5zAZIvPKDSXRtUepFRGT-4rkQvhDfCl0arZgLV9yXiLVbQCGmgdQYMFCo-zRrpF1ihlnwpXZSJiW-WCrVQJE5Fj5XxZnKgpfLsYTmDCcyGUL5bIKFrxktcwEQXwDrXNaXmKRZ-jFBbBZVKKXPDyBaZc1LfKVoKfyYrLaOq5_LpBV5JDlsYdLsNkLUxEYRzZA-Wsd5y7jmH5ByYiN-7Hxbf7p8fvX5fLp_v7L8vl4-PD3fJ-BhNl0YNtlHWZ3yjZWtI_g0mTpGmaNADrOI4u4mQdx0mSxHEaJc04vYjTJr-0-sNyRu_wTZCuWz7Jn0YrXnhw_R7k7LJzWXDXHsJWwmRkdGmVP3Eojm8Oe7UzHnqmj_1vGWxQUlsZbLnDdGBa-lv_ZFVS-tZTD2xRW5UNDKdHdKXRO3YY2Ppz7tpvyDkdCqFLo1UoM2KHvgDyJhSMDt3P1Oj6r-tWXDlbF8NWOXZuRDsYDtbK_1vHQQa7Gg5-FQYdwYT2yP3LwG9-QYo_eLLZCw?type=png)\n\n### Key Architectural Principles:\n\n1. **Serverless-First Approach**: Utilizing serverless technologies to minimize operational overhead and maximize scalability\n2. **Edge Computing**: Leveraging edge functions for low-latency AI processing and content delivery\n3. **AI-Driven Features**: Integrating multiple AI models for emotion recognition, content enhancement, and personalized interactions\n4. **Real-Time Communication**: Enabling seamless, persistent user interactions through durable objects and WebSockets\n5. **Privacy-Centric Design**: Processing sensitive data on-device when possible and implementing strict data governance\n6. **Extensible Platform**: Building a modular system that can easily incorporate new AI capabilities as they emerge\n\n## 2. Component Breakdown and Responsibilities\n\n### 2.1 Frontend Layer\n\n#### Next.js Application with React Server Components\n- **Responsibilities**: \n  - Deliver responsive, accessible UI across devices\n  - Handle client-side and server-side rendering\n  - Manage application state and user interactions\n  - Implement camera access and media capture\n  - Process real-time updates from backend services\n\n#### Key Components:\n- **Authentication Module**: Handles user registration, login, and session management\n- **Capture Interface**: Manages dual-camera access, preview, and capture functionality\n- **Feed Component**: Renders friend posts with AI-enhanced elements and interaction options\n- **Memory Journal**: Displays AI-curated collections of user's past moments\n- **Friend Insights**: Shows AI-generated connection suggestions and relationship insights\n- **Settings Panel**: Provides user preference management and privacy controls\n\n### 2.2 Backend Services\n\n#### User Service (Vercel Serverless Functions + Prisma + Neon PostgreSQL)\n- **Responsibilities**:\n  - Manage user profiles, relationships, and preferences\n  - Handle authentication and authorization\n  - Process friend requests and social connections\n  - Store and retrieve user activity metadata\n\n#### Content Service (Vercel Edge Functions + Upstash Redis + R2 Storage)\n- **Responsibilities**:\n  - Process and store media uploads\n  - Manage content distribution and access control\n  - Handle content moderation and filtering\n  - Implement content recommendation algorithms\n  - Cache frequently accessed content\n\n#### AI Processing Service (Vercel Edge Functions + OpenRouter)\n- **Responsibilities**:\n  - Coordinate emotion recognition processing\n  - Generate visual enhancements based on emotional context\n  - Create personalized interaction suggestions\n  - Analyze patterns in user content for Memory Journals\n  - Route requests to appropriate specialized AI models\n\n#### Real-Time Communication Service (Cloudflare Durable Objects + WebSockets)\n- **Responsibilities**:\n  - Maintain persistent connections for real-time updates\n  - Manage notification delivery\n  - Handle live interactions between users\n  - Ensure reliable message delivery and ordering\n\n#### Workflow Orchestration Service (Mastra Workflow Engine)\n- **Responsibilities**:\n  - Coordinate complex multi-step AI processing tasks\n  - Manage state for long-running operations\n  - Handle retry logic and error recovery\n  - Provide observability into processing pipelines\n\n### 2.3 AI Subsystems\n\n#### Emotion Recognition System (TensorFlow.js + Custom Models)\n- **Responsibilities**:\n  - Analyze facial expressions in captured media\n  - Detect environmental context and mood indicators\n  - Classify emotional states and confidence levels\n  - Provide on-device processing for privacy-sensitive data\n\n#### Visual Enhancement Engine (Custom Generative Models)\n- **Responsibilities**:\n  - Generate subtle visual elements based on emotional context\n  - Apply appropriate style transfers that preserve authenticity\n  - Create consistent visual language for emotional expressions\n  - Ensure enhancements complement rather than obscure original content\n\n#### Social Context Analyzer (Large Language Models)\n- **Responsibilities**:\n  - Analyze relationship patterns between users\n  - Generate personalized interaction suggestions\n  - Create meaningful memory collections\n  - Identify potentially significant moments for notifications\n\n## 3. Data Flow Diagrams and Descriptions\n\n### 3.1 Capture Flow\n\n![Capture Flow](https://mermaid.ink/img/pako:eNqVVE1v2zAM_SuETm2BJE7TtL0MGLYdBgzbDt16ECVQsRhbgyQZktwkQ_57KTtx2qTFsINNkY-PfI8UJ8hNRjCBfC3UX6lyNLnmc1DW0G7pD9PatLc21llbYxTtUXFTKoPK6Ba9485YpebSKlMYh3eC_fTKopKMO3vJreVK2AO3OyiYwysquZAWrCk5XagCeQITFe0LPifSvBLOfRPHYRibPaYw2fMSc3TIcyhUyWtUHEBHJW9A55T0d-dL7Jco6hmVBxs9xvFjnMBkiy8oNJdGlR6kVFpP7iqRC-EN8KXRqtmAtX3JeItVtAQaaB1Bg0cUHmeNdIusUco8Fa7KRMRWZYKtVAETkWPpfFmcqCl8vxpOYMJzIZQvlsgoWvKC1zARBfAOtc1oeYpFn6MUFsFlUopc8OIVplzUd8qUgp_JiotoqrnyG7QuI4csjesuDJO1MBGFdWQPlLPecW47huUfmIjcuh8XX--fHr9_WSye7u-_LBaPjw93i_sZTJRBD7ZRxmZ-o2RrSf8MJk2SNE2SBmAdx9FFnKzjOEmSOI2SZpxexGmTX1r9YTmjd_gqSNctH-TPoxEvPLj-DHJ22bksuGsP4VbCZGR0YZQ_cSiObw57tTMeeqaP_W8ZbFBSWxlsucN0YFr6W_9kVVL61lMPbFFblQ0Mp0d0pdE7dhjY-nPu2m_IOR0KoQujVSgzYoe-APImFIwO3c_U6Pqv61ZcWVMVw1Y5dm5EOxgO1sr_W8dBBrsaDn4VBh3BhPbI_cvAb35Bii-4jNhF?type=png)\n\n1. **User Receives Notification**: The app sends a contextual notification based on user patterns and potential meaningful moments.\n2. **Camera Activation**: User opens the app and activates the dual-camera system within the 2-minute window.\n3. **On-Device Emotion Analysis**: TensorFlow.js performs initial facial expression and context analysis directly on the device.\n4. **Capture Processing**:\n   - Raw images are temporarily stored\n   - Emotion data is sent to the AI Processing Service\n   - Visual enhancement options are generated based on emotional context\n5. **User Selection**: User toggles between \"Pure Real\" (unenhanced) and \"Feel Real\" (AI-enhanced) modes.\n6. **Content Storage**: Selected content is encrypted and stored in R2 Storage.\n7. **Feed Update**: Content becomes available in friends' feeds with appropriate emotional indicators.\n\n### 3.2 Social Interaction Flow\n\n![Social Interaction Flow](https://mermaid.ink/img/pako:eNqVVMFu2zAM_RWCp7ZAEqdpml4GDFsPBYZth3Y9CBKoWIytQZIMSW6SIf8-yk7sNGmx7WBT5OMj3yPFCTJTEEwgXQn1V6oCTanZHJQ1dLf0h2lt2jsbG2xbYhTtUXFTK4PKmBa9485YpebSKpMbh3eCffPKopKMO3vJreVK2AO3OyiYwysquZAWrKk4XagcWQITFe1zNifSvBLOfRPHYRibPaYw2fMKU3TIMyh0xUtUHEBHJW9A55T0d-cr7Jco6hmVBxs9xvFjnMBkiy8oNJdGlR6k1EZP7iqRC-EN8KXRqtmAtX3JeItVtAIaaB1Bg0cUHmeNdIusUco8Fa7KRMRWZYKtVAETkWPlfFmcqCl8vxpOYMJSIZQvlsgoWvKcFTAROfAOtc1oeYpFn6MUFsFlUopc8PwVplzUd8rkgp_JiotoqrnyG7QuI4csjesuDJO1MBGFdWQPlLPecW47hsUfmIjU2h8XX--fHr9_WSye7u-_LBaPjw93i_sZTJRBD7ZRxmZ-o2RrSf8MJk2SNE2SBmAdx9FFnKzjOEmSOI2SZpxexGmTX1r9YTmjd_gqSNctH-TPoxEvPLj-DHJ22bksuGsP4VbCZGR0bpQ_cSiObw57tTMeeqaP_W8ZbFBSWxlsucN0YFr6W_9kVVL61lMPbFFblQ0Mp0d0pdE7dhjY-nPu2m_IOR0KoXOjVSgzYoe-APImFIwO3c_U6Pqv61ZcWVPnw1Y5dm5EOxgO1sr_W8dBBrsaDn4VBh3BhPbI_cvAb35Bii-eZNi9?type=png)\n\n1. **Content Viewing**: User browses their feed and views a friend's post.\n2. **Context Analysis**: AI Processing Service analyzes the relationship context and post content.\n3. **Reaction Generation**: System generates personalized reaction options based on:\n   - User's communication style\n   - Relationship history with the friend\n   - Content context and emotional tone\n4. **User Interaction**: User selects or customizes a reaction.\n5. **Notification Delivery**: Friend receives a real-time notification via Durable Objects.\n6. **Relationship Update**: The interaction is recorded to enhance future AI-generated insights.\n\n### 3.3 Memory Journal Generation Flow\n\n![Memory Journal Flow](https://mermaid.ink/img/pako:eNqNVE1v2zAM_SuETu2AJE7TNL0MGLYeBgzbDt16ECVQsRhbgyQZktwkQ_57KTtx2qTFsINNkY-PfI8UJ8hNQTCBdCXUX6kKNKVmc1DW0N3SH6a16d7Z2GBbiVG0R8VNrQwqY1r0jjtjlZpLq0xuHN4J9s0ri0oy7uwlt5YrYQ_c7qBgDq-o5EJasKbidKFyZAlMVLTP2ZxI80o4900ch2Fs9pjCZM8rTNEhz6DQFa9QcQAdlbwBnVPS352vsF-iqGdUHmz0GMePcQKTLb6g0FwaVXqQUhs9uatELoQ3wJdGq2YD1vYl4y1W0QpooDUEDR5ReJw10i2yRinzVLgqExFblQm2UgVMRI6V82VxoqbwfTWcwISlQihfLJFRtOQ5K2AicuAdapvR8hSLPkcpLILLpBS54PkrTLmo75TJBT-TFRfRVHPlN2hdRg5ZGtddG"
  ],
  "tech": []
}
[2025-03-06T09:19:35.881Z] [INFO] [DOCUMENTATION] Generating index.md...
[2025-03-06T09:19:35.881Z] [INFO] [LLM:089spw1mjeid] Request to anthropic/claude-3.7-sonnet
[2025-03-06T09:19:35.881Z] [INFO] [LLM:089spw1mjeid] LLM Request
[2025-03-06T09:19:35.881Z] [INFO] [LLM:089spw1mjeid] Data: 
    You are a technical documentation specialist.
    
    Generate a comprehensive index.md for a project with the following details:
    
    Project Prompt: 
    
    Tech Stack: {
  "frameworks": [],
  "libraries": [],
  "apis": [],
  "tools": [],
  "documentationLinks": {}
}
    
    Project Content:
    - Overview: 
    - Core Features: 
    - Architecture: # lol: Authentic Moments, Enhanced by AI - Architecture Document

## 1. High-Level System Architecture Overview

The "lol" application is designed as a modern, AI-enhanced social platform that prioritizes authentic interactions while leveraging artificial intelligence to enrich user experiences. The architecture follows a microservices approach with a clear separation of concerns, enabling scalability, maintainability, and resilience.

![High-Level Architecture Diagram](https://mermaid.ink/img/pako:eNqNVMFu2zAM_RWBp7ZAE6dNm16GAVuHAcO2Q7ceuglULcbWIEuGJDfNkH8fZSVOk3bYfLAl8vGRfKQ0QmYlwQSKlVB_pSrRpJrPQTlDvYUfzGizO9pYZ1yLUbQnxW2tLCqjDXrHXWMqNZdO2dJYvBPsm1cGlWTcuXNuLVfCHrjdQcEtXlDJhXLgdMXpQpXIE5ioaFfyOZHmlfDaGfUYx2EYmz2mMNnzCnO0yHMoVMVrVBxAJyVvQOeU9HfnK-yXKOoZlQMbPcbxY5zAZIvPKDSXRtUepFRGT-4rkQvhDfCl0arZgLV9yXiLVbQCGmgdQYMFCo-zRrpF1ihlnwpXZSJiW-WCrVQJE5Fj5XxZnKgpfLsYTmDCcyGUL5bIKFrxktcwEQXwDrXNaXmKRZ-jFBbBZVKKXPDyBaZc1LfKVoKfyYrLaOq5_LpBV5JDlsYdLsNkLUxEYRzZA-Wsd5y7jmH5ByYiN-7Hxbf7p8fvX5fLp_v7L8vl4-PD3fJ-BhNl0YNtlHWZ3yjZWtI_g0mTpGmaNADrOI4u4mQdx0mSxHEaJc04vYjTJr-0-sNyRu_wTZCuWz7Jn0YrXnhw_R7k7LJzWXDXHsJWwmRkdGmVP3Eojm8Oe7UzHnqmj_1vGWxQUlsZbLnDdGBa-lv_ZFVS-tZTD2xRW5UNDKdHdKXRO3YY2Ppz7tpvyDkdCqFLo1UoM2KHvgDyJhSMDt3P1Oj6r-tWXDlbF8NWOXZuRDsYDtbK_1vHQQa7Gg5-FQYdwYT2yP3LwG9-QYo_eLLZCw?type=png)

### Key Architectural Principles:

1. **Serverless-First Approach**: Utilizing serverless technologies to minimize operational overhead and maximize scalability
2. **Edge Computing**: Leveraging edge functions for low-latency AI processing and content delivery
3. **AI-Driven Features**: Integrating multiple AI models for emotion recognition, content enhancement, and personalized interactions
4. **Real-Time Communication**: Enabling seamless, persistent user interactions through durable objects and WebSockets
5. **Privacy-Centric Design**: Processing sensitive data on-device when possible and implementing strict data governance
6. **Extensible Platform**: Building a modular system that can easily incorporate new AI capabilities as they emerge

## 2. Component Breakdown and Responsibilities

### 2.1 Frontend Layer

#### Next.js Application with React Server Components
- **Responsibilities**: 
  - Deliver responsive, accessible UI across devices
  - Handle client-side and server-side rendering
  - Manage application state and user interactions
  - Implement camera access and media capture
  - Process real-time updates from backend services

#### Key Components:
- **Authentication Module**: Handles user registration, login, and session management
- **Capture Interface**: Manages dual-camera access, preview, and capture functionality
- **Feed Component**: Renders friend posts with AI-enhanced elements and interaction options
- **Memory Journal**: Displays AI-curated collections of user's past moments
- **Friend Insights**: Shows AI-generated connection suggestions and relationship insights
- **Settings Panel**: Provides user preference management and privacy controls

### 2.2 Backend Services

#### User Service (Vercel Serverless Functions + Prisma + Neon PostgreSQL)
- **Responsibilities**:
  - Manage user profiles, relationships, and preferences
  - Handle authentication and authorization
  - Process friend requests and social connections
  - Store and retrieve user activity metadata

#### Content Service (Vercel Edge Functions + Upstash Redis + R2 Storage)
- **Responsibilities**:
  - Process and store media uploads
  - Manage content distribution and access control
  - Handle content moderation and filtering
  - Implement content recommendation algorithms
  - Cache frequently accessed content

#### AI Processing Service (Vercel Edge Functions + OpenRouter)
- **Responsibilities**:
  - Coordinate emotion recognition processing
  - Generate visual enhancements based on emotional context
  - Create personalized interaction suggestions
  - Analyze patterns in user content for Memory Journals
  - Route requests to appropriate specialized AI models

#### Real-Time Communication Service (Cloudflare Durable Objects + WebSockets)
- **Responsibilities**:
  - Maintain persistent connections for real-time updates
  - Manage notification delivery
  - Handle live interactions between users
  - Ensure reliable message delivery and ordering

#### Workflow Orchestration Service (Mastra Workflow Engine)
- **Responsibilities**:
  - Coordinate complex multi-step AI processing tasks
  - Manage state for long-running operations
  - Handle retry logic and error recovery
  - Provide observability into processing pipelines

### 2.3 AI Subsystems

#### Emotion Recognition System (TensorFlow.js + Custom Models)
- **Responsibilities**:
  - Analyze facial expressions in captured media
  - Detect environmental context and mood indicators
  - Classify emotional states and confidence levels
  - Provide on-device processing for privacy-sensitive data

#### Visual Enhancement Engine (Custom Generative Models)
- **Responsibilities**:
  - Generate subtle visual elements based on emotional context
  - Apply appropriate style transfers that preserve authenticity
  - Create consistent visual language for emotional expressions
  - Ensure enhancements complement rather than obscure original content

#### Social Context Analyzer (Large Language Models)
- **Responsibilities**:
  - Analyze relationship patterns between users
  - Generate personalized interaction suggestions
  - Create meaningful memory collections
  - Identify potentially significant moments for notifications

## 3. Data Flow Diagrams and Descriptions

### 3.1 Capture Flow

![Capture Flow](https://mermaid.ink/img/pako:eNqVVE1v2zAM_SuETm2BJE7TtL0MGLYdBgzbDt16ECVQsRhbgyQZktwkQ_57KTtx2qTFsINNkY-PfI8UJ8hNRjCBfC3UX6lyNLnmc1DW0G7pD9PatLc21llbYxTtUXFTKoPK6Ba9485YpebSKlMYh3eC_fTKopKMO3vJreVK2AO3OyiYwysquZAWrCk5XagCeQITFe0LPifSvBLOfRPHYRibPaYw2fMSc3TIcyhUyWtUHEBHJW9A55T0d-dL7Jco6hmVBxs9xvFjnMBkiy8oNJdGlR6kVFpP7iqRC-EN8KXRqtmAtX3JeItVtAQaaB1Bg0cUHmeNdIusUco8Fa7KRMRWZYKtVAETkWPpfFmcqCl8vxpOYMJzIZQvlsgoWvKC1zARBfAOtc1oeYpFn6MUFsFlUopc8OIVplzUd8qUgp_JiotoqrnyG7QuI4csjesuDJO1MBGFdWQPlLPecW47huUfmIjcuh8XX--fHr9_WSye7u-_LBaPjw93i_sZTJRBD7ZRxmZ-o2RrSf8MJk2SNE2SBmAdx9FFnKzjOEmSOI2SZpxexGmTX1r9YTmjd_gqSNctH-TPoxEvPLj-DHJ22bksuGsP4VbCZGR0YZQ_cSiObw57tTMeeqaP_W8ZbFBSWxlsucN0YFr6W_9kVVL61lMPbFFblQ0Mp0d0pdE7dhjY-nPu2m_IOR0KoQujVSgzYoe-APImFIwO3c_U6Pqv61ZcWVMVw1Y5dm5EOxgO1sr_W8dBBrsaDn4VBh3BhPbI_cvAb35Bii-4jNhF?type=png)

1. **User Receives Notification**: The app sends a contextual notification based on user patterns and potential meaningful moments.
2. **Camera Activation**: User opens the app and activates the dual-camera system within the 2-minute window.
3. **On-Device Emotion Analysis**: TensorFlow.js performs initial facial expression and context analysis directly on the device.
4. **Capture Processing**:
   - Raw images are temporarily stored
   - Emotion data is sent to the AI Processing Service
   - Visual enhancement options are generated based on emotional context
5. **User Selection**: User toggles between "Pure Real" (unenhanced) and "Feel Real" (AI-enhanced) modes.
6. **Content Storage**: Selected content is encrypted and stored in R2 Storage.
7. **Feed Update**: Content becomes available in friends' feeds with appropriate emotional indicators.

### 3.2 Social Interaction Flow

![Social Interaction Flow](https://mermaid.ink/img/pako:eNqVVMFu2zAM_RWCp7ZAEqdpml4GDFsPBYZth3Y9CBKoWIytQZIMSW6SIf8-yk7sNGmx7WBT5OMj3yPFCTJTEEwgXQn1V6oCTanZHJQ1dLf0h2lt2jsbG2xbYhTtUXFTK4PKmBa9485YpebSKpMbh3eCffPKopKMO3vJreVK2AO3OyiYwysquZAWrKk4XagcWQITFe1zNifSvBLOfRPHYRibPaYw2fMKU3TIMyh0xUtUHEBHJW9A55T0d-cr7Jco6hmVBxs9xvFjnMBkiy8oNJdGlR6k1EZP7iqRC-EN8KXRqtmAtX3JeItVtAIaaB1Bg0cUHmeNdIusUco8Fa7KRMRWZYKtVAETkWPlfFmcqCl8vxpOYMJSIZQvlsgoWvKcFTAROfAOtc1oeYpFn6MUFsFlUopc8PwVplzUd8rkgp_JiotoqrnyG7QuI4csjesuDJO1MBGFdWQPlLPecW47hsUfmIjU2h8XX--fHr9_WSye7u-_LBaPjw93i_sZTJRBD7ZRxmZ-o2RrSf8MJk2SNE2SBmAdx9FFnKzjOEmSOI2SZpxexGmTX1r9YTmjd_gqSNctH-TPoxEvPLj-DHJ22bksuGsP4VbCZGR0bpQ_cSiObw57tTMeeqaP_W8ZbFBSWxlsucN0YFr6W_9kVVL61lMPbFFblQ0Mp0d0pdE7dhjY-nPu2m_IOR0KoXOjVSgzYoe-APImFIwO3c_U6Pqv61ZcWVPnw1Y5dm5EOxgO1sr_W8dBBrsaDn4VBh3BhPbI_cvAb35Bii-eZNi9?type=png)

1. **Content Viewing**: User browses their feed and views a friend's post.
2. **Context Analysis**: AI Processing Service analyzes the relationship context and post content.
3. **Reaction Generation**: System generates personalized reaction options based on:
   - User's communication style
   - Relationship history with the friend
   - Content context and emotional tone
4. **User Interaction**: User selects or customizes a reaction.
5. **Notification Delivery**: Friend receives a real-time notification via Durable Objects.
6. **Relationship Update**: The interaction is recorded to enhance future AI-generated insights.

### 3.3 Memory Journal Generation Flow

![Memory Journal Flow](https://mermaid.ink/img/pako:eNqNVE1v2zAM_SuETu2AJE7TNL0MGLYeBgzbDt16ECVQsRhbgyQZktwkQ_57KTtx2qTFsINNkY-PfI8UJ8hNQTCBdCXUX6kKNKVmc1DW0N3SH6a16d7Z2GBbiVG0R8VNrQwqY1r0jjtjlZpLq0xuHN4J9s0ri0oy7uwlt5YrYQ_c7qBgDq-o5EJasKbidKFyZAlMVLTP2ZxI80o4900ch2Fs9pjCZM8rTNEhz6DQFa9QcQAdlbwBnVPS352vsF-iqGdUHmz0GMePcQKTLb6g0FwaVXqQUhs9uatELoQ3wJdGq2YD1vYl4y1W0QpooDUEDR5ReJw10i2yRinzVLgqExFblQm2UgVMRI6V82VxoqbwfTWcwISlQihfLJFRtOQ5K2AicuAdapvR8hSLPkcpLILLpBS54PkrTLmo75TJBT-TFRfRVHPlN2hdRg5ZGtddG
    
    The index.md should include:
    1. Project title and description
    2. Key features
    3. Technology overview
    4. Getting started section
    5. Project structure overview
    
    Format the document in Markdown.
  
[2025-03-06T09:19:35.882Z] [INFO] [LLM:089spw1mjeid] Using base URL: http://localhost:9000
[LLM API] Received request
[LLM API] Request params: model=anthropic/claude-3.7-sonnet, temp=0.7
[LLM API] Created simple user message
[LLM API] Calling OpenRouter with model: anthropic/claude-3.7-sonnet
[LLM API] Success! Response contains 1 choices
 POST /api/llm 200 in 17248ms
[2025-03-06T09:19:53.141Z] [INFO] [LLM:089spw1mjeid] Response status: 200
[2025-03-06T09:19:53.141Z] [INFO] [LLM:089spw1mjeid] Response length: 4187
[2025-03-06T09:19:53.141Z] [INFO] [LLM:089spw1mjeid] LLM Response
[2025-03-06T09:19:53.141Z] [INFO] [LLM:089spw1mjeid] Data: # lol: Authentic Moments, Enhanced by AI

## Project Overview

"lol" is a modern social platform designed to foster authentic interactions while leveraging artificial intelligence to enrich user experiences. The application prioritizes genuine human connection through a unique dual-camera system that captures both the user and their surroundings, while thoughtfully applying AI enhancements to create more meaningful digital interactions.

## Key Features

- **Dual-Camera Capture System**: Simultaneously records both the user and their environment to provide contextual authenticity
- **Emotion Recognition**: Analyzes facial expressions and environmental context to understand emotional states
- **AI-Enhanced Visuals**: Subtly enhances content based on detected emotions while preserving authenticity
- **Memory Journal**: AI-curated collections of past moments that highlight meaningful connections
- **Friend Insights**: AI-generated suggestions and relationship insights to deepen social connections
- **Real-Time Interactions**: Seamless, persistent communication between users through modern web technologies

## Technology Overview

### Architecture

The application follows a microservices approach with a serverless-first design philosophy:

- **Frontend Layer**: Next.js application with React Server Components
- **Backend Services**:
  - User Service: Vercel Serverless Functions with Prisma and Neon PostgreSQL
  - Content Service: Vercel Edge Functions with Upstash Redis and R2 Storage
  - AI Processing Service: Vercel Edge Functions integrated with OpenRouter
  - Real-Time Communication: Cloudflare Durable Objects with WebSockets
  - Workflow Orchestration: Mastra Workflow Engine

### AI Subsystems

- **Emotion Recognition System**: TensorFlow.js with custom models for on-device processing
- **Visual Enhancement Engine**: Custom generative models for context-aware visual elements
- **Social Context Analyzer**: Large Language Models for relationship pattern analysis

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/lol.git
   cd lol
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration values.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
lol/
├── components/           # Reusable UI components
│   ├── auth/             # Authentication-related components
│   ├── capture/          # Camera and media capture components
│   ├── feed/             # Social feed components
│   └── journal/          # Memory journal components
├── lib/                  # Shared utilities and helpers
│   ├── ai/               # AI processing utilities
│   ├── api/              # API client functions
│   └── hooks/            # Custom React hooks
├── pages/                # Application routes and API endpoints
│   ├── api/              # Backend API routes
│   └── ...               # Frontend pages
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── styles/               # Global styles and theme configuration
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Documentation

For more detailed information about the system architecture and components, please refer to the following documentation:

- [Architecture Overview](./docs/architecture.md)
- [AI Subsystems](./docs/ai-subsystems.md)
- [Data Flow Documentation](./docs/data-flow.md)
- [API Reference](./docs/api-reference.md)
- [Deployment Guide](./docs/deployment.md)

## Contributing

Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
[2025-03-06T09:19:53.142Z] [INFO] [DOCUMENTATION] Generating design.md...
[2025-03-06T09:19:53.142Z] [INFO] [LLM:sw83yyv5s3] Request to anthropic/claude-3.7-sonnet
[2025-03-06T09:19:53.142Z] [INFO] [LLM:sw83yyv5s3] LLM Request
[2025-03-06T09:19:53.142Z] [INFO] [LLM:sw83yyv5s3] Data: 
    You are a technical documentation specialist with expertise in software architecture.
    
    Generate a comprehensive design.md for a project with the following details:
    
    Project Prompt: 
    
    Tech Stack: {
  "frameworks": [],
  "libraries": [],
  "apis": [],
  "tools": [],
  "documentationLinks": {}
}
    
    Project Content:
    - Overview: 
    - Core Features: 
    - Architecture: # lol: Authentic Moments, Enhanced by AI - Architecture Document

## 1. High-Level System Architecture Overview

The "lol" application is designed as a modern, AI-enhanced social platform that prioritizes authentic interactions while leveraging artificial intelligence to enrich user experiences. The architecture follows a microservices approach with a clear separation of concerns, enabling scalability, maintainability, and resilience.

![High-Level Architecture Diagram](https://mermaid.ink/img/pako:eNqNVMFu2zAM_RWBp7ZAE6dNm16GAVuHAcO2Q7ceuglULcbWIEuGJDfNkH8fZSVOk3bYfLAl8vGRfKQ0QmYlwQSKlVB_pSrRpJrPQTlDvYUfzGizO9pYZ1yLUbQnxW2tLCqjDXrHXWMqNZdO2dJYvBPsm1cGlWTcuXNuLVfCHrjdQcEtXlDJhXLgdMXpQpXIE5ioaFfyOZHmlfDaGfUYx2EYmz2mMNnzCnO0yHMoVMVrVBxAJyVvQOeU9HfnK-yXKOoZlQMbPcbxY5zAZIvPKDSXRtUepFRGT-4rkQvhDfCl0arZgLV9yXiLVbQCGmgdQYMFCo-zRrpF1ihlnwpXZSJiW-WCrVQJE5Fj5XxZnKgpfLsYTmDCcyGUL5bIKFrxktcwEQXwDrXNaXmKRZ-jFBbBZVKKXPDyBaZc1LfKVoKfyYrLaOq5_LpBV5JDlsYdLsNkLUxEYRzZA-Wsd5y7jmH5ByYiN-7Hxbf7p8fvX5fLp_v7L8vl4-PD3fJ-BhNl0YNtlHWZ3yjZWtI_g0mTpGmaNADrOI4u4mQdx0mSxHEaJc04vYjTJr-0-sNyRu_wTZCuWz7Jn0YrXnhw_R7k7LJzWXDXHsJWwmRkdGmVP3Eojm8Oe7UzHnqmj_1vGWxQUlsZbLnDdGBa-lv_ZFVS-tZTD2xRW5UNDKdHdKXRO3YY2Ppz7tpvyDkdCqFLo1UoM2KHvgDyJhSMDt3P1Oj6r-tWXDlbF8NWOXZuRDsYDtbK_1vHQQa7Gg5-FQYdwYT2yP3LwG9-QYo_eLLZCw?type=png)

### Key Architectural Principles:

1. **Serverless-First Approach**: Utilizing serverless technologies to minimize operational overhead and maximize scalability
2. **Edge Computing**: Leveraging edge functions for low-latency AI processing and content delivery
3. **AI-Driven Features**: Integrating multiple AI models for emotion recognition, content enhancement, and personalized interactions
4. **Real-Time Communication**: Enabling seamless, persistent user interactions through durable objects and WebSockets
5. **Privacy-Centric Design**: Processing sensitive data on-device when possible and implementing strict data governance
6. **Extensible Platform**: Building a modular system that can easily incorporate new AI capabilities as they emerge

## 2. Component Breakdown and Responsibilities

### 2.1 Frontend Layer

#### Next.js Application with React Server Components
- **Responsibilities**: 
  - Deliver responsive, accessible UI across devices
  - Handle client-side and server-side rendering
  - Manage application state and user interactions
  - Implement camera access and media capture
  - Process real-time updates from backend services

#### Key Components:
- **Authentication Module**: Handles user registration, login, and session management
- **Capture Interface**: Manages dual-camera access, preview, and capture functionality
- **Feed Component**: Renders friend posts with AI-enhanced elements and interaction options
- **Memory Journal**: Displays AI-curated collections of user's past moments
- **Friend Insights**: Shows AI-generated connection suggestions and relationship insights
- **Settings Panel**: Provides user preference management and privacy controls

### 2.2 Backend Services

#### User Service (Vercel Serverless Functions + Prisma + Neon PostgreSQL)
- **Responsibilities**:
  - Manage user profiles, relationships, and preferences
  - Handle authentication and authorization
  - Process friend requests and social connections
  - Store and retrieve user activity metadata

#### Content Service (Vercel Edge Functions + Upstash Redis + R2 Storage)
- **Responsibilities**:
  - Process and store media uploads
  - Manage content distribution and access control
  - Handle content moderation and filtering
  - Implement content recommendation algorithms
  - Cache frequently accessed content

#### AI Processing Service (Vercel Edge Functions + OpenRouter)
- **Responsibilities**:
  - Coordinate emotion recognition processing
  - Generate visual enhancements based on emotional context
  - Create personalized interaction suggestions
  - Analyze patterns in user content for Memory Journals
  - Route requests to appropriate specialized AI models

#### Real-Time Communication Service (Cloudflare Durable Objects + WebSockets)
- **Responsibilities**:
  - Maintain persistent connections for real-time updates
  - Manage notification delivery
  - Handle live interactions between users
  - Ensure reliable message delivery and ordering

#### Workflow Orchestration Service (Mastra Workflow Engine)
- **Responsibilities**:
  - Coordinate complex multi-step AI processing tasks
  - Manage state for long-running operations
  - Handle retry logic and error recovery
  - Provide observability into processing pipelines

### 2.3 AI Subsystems

#### Emotion Recognition System (TensorFlow.js + Custom Models)
- **Responsibilities**:
  - Analyze facial expressions in captured media
  - Detect environmental context and mood indicators
  - Classify emotional states and confidence levels
  - Provide on-device processing for privacy-sensitive data

#### Visual Enhancement Engine (Custom Generative Models)
- **Responsibilities**:
  - Generate subtle visual elements based on emotional context
  - Apply appropriate style transfers that preserve authenticity
  - Create consistent visual language for emotional expressions
  - Ensure enhancements complement rather than obscure original content

#### Social Context Analyzer (Large Language Models)
- **Responsibilities**:
  - Analyze relationship patterns between users
  - Generate personalized interaction suggestions
  - Create meaningful memory collections
  - Identify potentially significant moments for notifications

## 3. Data Flow Diagrams and Descriptions

### 3.1 Capture Flow

![Capture Flow](https://mermaid.ink/img/pako:eNqVVE1v2zAM_SuETm2BJE7TtL0MGLYdBgzbDt16ECVQsRhbgyQZktwkQ_57KTtx2qTFsINNkY-PfI8UJ8hNRjCBfC3UX6lyNLnmc1DW0G7pD9PatLc21llbYxTtUXFTKoPK6Ba9485YpebSKlMYh3eC_fTKopKMO3vJreVK2AO3OyiYwysquZAWrCk5XagCeQITFe0LPifSvBLOfRPHYRibPaYw2fMSc3TIcyhUyWtUHEBHJW9A55T0d-dL7Jco6hmVBxs9xvFjnMBkiy8oNJdGlR6kVFpP7iqRC-EN8KXRqtmAtX3JeItVtAQaaB1Bg0cUHmeNdIusUco8Fa7KRMRWZYKtVAETkWPpfFmcqCl8vxpOYMJzIZQvlsgoWvKC1zARBfAOtc1oeYpFn6MUFsFlUopc8OIVplzUd8qUgp_JiotoqrnyG7QuI4csjesuDJO1MBGFdWQPlLPecW47huUfmIjcuh8XX--fHr9_WSye7u-_LBaPjw93i_sZTJRBD7ZRxmZ-o2RrSf8MJk2SNE2SBmAdx9FFnKzjOEmSOI2SZpxexGmTX1r9YTmjd_gqSNctH-TPoxEvPLj-DHJ22bksuGsP4VbCZGR0YZQ_cSiObw57tTMeeqaP_W8ZbFBSWxlsucN0YFr6W_9kVVL61lMPbFFblQ0Mp0d0pdE7dhjY-nPu2m_IOR0KoQujVSgzYoe-APImFIwO3c_U6Pqv61ZcWVMVw1Y5dm5EOxgO1sr_W8dBBrsaDn4VBh3BhPbI_cvAb35Bii-4jNhF?type=png)

1. **User Receives Notification**: The app sends a contextual notification based on user patterns and potential meaningful moments.
2. **Camera Activation**: User opens the app and activates the dual-camera system within the 2-minute window.
3. **On-Device Emotion Analysis**: TensorFlow.js performs initial facial expression and context analysis directly on the device.
4. **Capture Processing**:
   - Raw images are temporarily stored
   - Emotion data is sent to the AI Processing Service
   - Visual enhancement options are generated based on emotional context
5. **User Selection**: User toggles between "Pure Real" (unenhanced) and "Feel Real" (AI-enhanced) modes.
6. **Content Storage**: Selected content is encrypted and stored in R2 Storage.
7. **Feed Update**: Content becomes available in friends' feeds with appropriate emotional indicators.

### 3.2 Social Interaction Flow

![Social Interaction Flow](https://mermaid.ink/img/pako:eNqVVMFu2zAM_RWCp7ZAEqdpml4GDFsPBYZth3Y9CBKoWIytQZIMSW6SIf8-yk7sNGmx7WBT5OMj3yPFCTJTEEwgXQn1V6oCTanZHJQ1dLf0h2lt2jsbG2xbYhTtUXFTK4PKmBa9485YpebSKpMbh3eCffPKopKMO3vJreVK2AO3OyiYwysquZAWrKk4XagcWQITFe1zNifSvBLOfRPHYRibPaYw2fMKU3TIMyh0xUtUHEBHJW9A55T0d-cr7Jco6hmVBxs9xvFjnMBkiy8oNJdGlR6k1EZP7iqRC-EN8KXRqtmAtX3JeItVtAIaaB1Bg0cUHmeNdIusUco8Fa7KRMRWZYKtVAETkWPlfFmcqCl8vxpOYMJSIZQvlsgoWvKcFTAROfAOtc1oeYpFn6MUFsFlUopc8PwVplzUd8rkgp_JiotoqrnyG7QuI4csjesuDJO1MBGFdWQPlLPecW47hsUfmIjU2h8XX--fHr9_WSye7u-_LBaPjw93i_sZTJRBD7ZRxmZ-o2RrSf8MJk2SNE2SBmAdx9FFnKzjOEmSOI2SZpxexGmTX1r9YTmjd_gqSNctH-TPoxEvPLj-DHJ22bksuGsP4VbCZGR0bpQ_cSiObw57tTMeeqaP_W8ZbFBSWxlsucN0YFr6W_9kVVL61lMPbFFblQ0Mp0d0pdE7dhjY-nPu2m_IOR0KoXOjVSgzYoe-APImFIwO3c_U6Pqv61ZcWVPnw1Y5dm5EOxgO1sr_W8dBBrsaDn4VBh3BhPbI_cvAb35Bii-eZNi9?type=png)

1. **Content Viewing**: User browses their feed and views a friend's post.
2. **Context Analysis**: AI Processing Service analyzes the relationship context and post content.
3. **Reaction Generation**: System generates personalized reaction options based on:
   - User's communication style
   - Relationship history with the friend
   - Content context and emotional tone
4. **User Interaction**: User selects or customizes a reaction.
5. **Notification Delivery**: Friend receives a real-time notification via Durable Objects.
6. **Relationship Update**: The interaction is recorded to enhance future AI-generated insights.

### 3.3 Memory Journal Generation Flow

![Memory Journal Flow](https://mermaid.ink/img/pako:eNqNVE1v2zAM_SuETu2AJE7TNL0MGLYeBgzbDt16ECVQsRhbgyQZktwkQ_57KTtx2qTFsINNkY-PfI8UJ8hNQTCBdCXUX6kKNKVmc1DW0N3SH6a16d7Z2GBbiVG0R8VNrQwqY1r0jjtjlZpLq0xuHN4J9s0ri0oy7uwlt5YrYQ_c7qBgDq-o5EJasKbidKFyZAlMVLTP2ZxI80o4900ch2Fs9pjCZM8rTNEhz6DQFa9QcQAdlbwBnVPS352vsF-iqGdUHmz0GMePcQKTLb6g0FwaVXqQUhs9uatELoQ3wJdGq2YD1vYl4y1W0QpooDUEDR5ReJw10i2yRinzVLgqExFblQm2UgVMRI6V82VxoqbwfTWcwISlQihfLJFRtOQ5K2AicuAdapvR8hSLPkcpLILLpBS54PkrTLmo75TJBT-TFRfRVHPlN2hdRg5ZGtddG
    
    The design.md should include:
    1. Architecture overview
    2. Component design
    3. Data models
    4. API design (if applicable)
    5. UI/UX considerations
    
    Format the document in Markdown with appropriate headings, code blocks, and diagrams described in text.
  
[2025-03-06T09:19:53.143Z] [INFO] [LLM:sw83yyv5s3] Using base URL: http://localhost:9000
[LLM API] Received request
[LLM API] Request params: model=anthropic/claude-3.7-sonnet, temp=0.7
[LLM API] Created simple user message
[LLM API] Calling OpenRouter with model: anthropic/claude-3.7-sonnet
 ✓ Compiled in 1193ms (1919 modules)
 GET / 200 in 105ms
 GET /jobs 200 in 107ms
[LLM API] Success! Response contains 1 choices
 POST /api/llm 200 in 50620ms
[2025-03-06T09:20:43.770Z] [INFO] [LLM:sw83yyv5s3] Response status: 200
[2025-03-06T09:20:43.770Z] [INFO] [LLM:sw83yyv5s3] Response length: 11885
[2025-03-06T09:20:43.770Z] [INFO] [LLM:sw83yyv5s3] LLM Response
[2025-03-06T09:20:43.770Z] [INFO] [LLM:sw83yyv5s3] Data: # lol: Authentic Moments, Enhanced by AI - Design Document

## 1. Architecture Overview

"lol" is a modern social platform that captures authentic moments while using AI to enhance the user experience. The system follows a microservices architecture with a serverless-first approach to ensure scalability, maintainability, and resilience.

### 1.1 High-Level Architecture

```
┌─────────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│                 │     │                     │     │                  │
│  Client Layer   │────▶│  Application Layer  │────▶│  Services Layer  │
│  (Next.js/React)│     │  (Serverless/Edge)  │     │  (Data/Storage)  │
│                 │◀────│                     │◀────│                  │
└─────────────────┘     └─────────────────────┘     └──────────────────┘
         │                        │                          │
         │                        │                          │
         ▼                        ▼                          ▼
┌─────────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│                 │     │                     │     │                  │
│  AI Processing  │◀───▶│  Real-Time Comms    │◀───▶│  Content Storage │
│  Subsystems     │     │  (Durable Objects)  │     │  (R2/Redis)      │
│                 │     │                     │     │                  │
└─────────────────┘     └─────────────────────┘     └──────────────────┘
```

### 1.2 Key Architectural Principles

1. **Serverless-First**: Minimize operational overhead through serverless technologies
2. **Edge Computing**: Process data close to users for low-latency interactions
3. **AI Integration**: Leverage multiple AI models for emotion recognition and content enhancement
4. **Real-Time Communication**: Enable persistent connections for immediate interactions
5. **Privacy-Centric Design**: Process sensitive data on-device when possible
6. **Modularity**: Build an extensible system that can incorporate new capabilities

## 2. Component Design

### 2.1 Frontend Layer

#### 2.1.1 Next.js Application with React

The frontend is built with Next.js and React, utilizing React Server Components for optimal performance.

**Key Components:**
- **Authentication Module**: User registration, login, and session management
- **Capture Interface**: Camera access, preview, and capture functionality
- **Feed Component**: Renders posts with AI-enhanced elements
- **Memory Journal**: Displays AI-curated collections of past moments
- **Friend Insights**: Shows connection suggestions and relationship insights
- **Settings Panel**: User preference and privacy controls

#### 2.1.2 Client-Side Processing

- TensorFlow.js for on-device emotion recognition
- WebRTC for camera access and media handling
- Service Worker for offline capabilities and background processing

### 2.2 Backend Services

#### 2.2.1 User Service

**Technologies:**
- Vercel Serverless Functions
- Prisma ORM
- Neon PostgreSQL

**Responsibilities:**
- User profile management
- Authentication and authorization
- Friend relationships and social graph
- User preferences storage

#### 2.2.2 Content Service

**Technologies:**
- Vercel Edge Functions
- Upstash Redis
- R2 Storage

**Responsibilities:**
- Media upload processing
- Content distribution
- Moderation and filtering
- Content recommendation

#### 2.2.3 AI Processing Service

**Technologies:**
- Vercel Edge Functions
- OpenRouter for AI model routing

**Responsibilities:**
- Emotion recognition coordination
- Visual enhancement generation
- Personalized interaction suggestions
- Memory journal curation

#### 2.2.4 Real-Time Communication Service

**Technologies:**
- Cloudflare Durable Objects
- WebSockets

**Responsibilities:**
- Persistent connections for real-time updates
- Notification delivery
- Live interactions between users
- Message delivery and ordering

#### 2.2.5 Workflow Orchestration

**Technologies:**
- Mastra Workflow Engine

**Responsibilities:**
- Coordinate multi-step AI processing
- Manage state for long-running operations
- Handle retry logic and error recovery
- Provide processing pipeline observability

### 2.3 AI Subsystems

#### 2.3.1 Emotion Recognition System

**Technologies:**
- TensorFlow.js
- Custom emotion recognition models

**Responsibilities:**
- Analyze facial expressions
- Detect environmental context
- Classify emotional states
- Provide on-device processing

#### 2.3.2 Visual Enhancement Engine

**Technologies:**
- Custom generative models

**Responsibilities:**
- Generate visual elements based on emotional context
- Apply style transfers preserving authenticity
- Create consistent visual language for emotions
- Complement rather than obscure original content

#### 2.3.3 Social Context Analyzer

**Technologies:**
- Large Language Models

**Responsibilities:**
- Analyze relationship patterns
- Generate interaction suggestions
- Create memory collections
- Identify significant moments

## 3. Data Models

### 3.1 User Model

```typescript
type User = {
  id: string;
  username: string;
  email: string;
  displayName: string;
  profileImage: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
  privacySettings: PrivacySettings;
};

type UserPreferences = {
  captureReminders: boolean;
  enhancementLevel: 'none' | 'subtle' | 'moderate';
  notificationSettings: NotificationSettings;
};

type PrivacySettings = {
  dataProcessingLocation: 'device-only' | 'cloud';
  contentVisibility: 'friends-only' | 'selected-friends';
  allowTagging: boolean;
};
```

### 3.2 Relationship Model

```typescript
type Relationship = {
  id: string;
  userA: string; // User ID
  userB: string; // User ID
  status: 'pending' | 'active' | 'blocked';
  closeness: number; // AI-calculated metric
  interactionFrequency: number;
  createdAt: Date;
  updatedAt: Date;
};
```

### 3.3 Content Model

```typescript
type Content = {
  id: string;
  userId: string;
  frontImage: string; // URL to storage
  backImage: string; // URL to storage
  enhancedImage: string | null; // URL to AI-enhanced version
  emotionData: EmotionData;
  createdAt: Date;
  visibility: 'friends-only' | 'selected-friends';
  reactions: Reaction[];
};

type EmotionData = {
  primaryEmotion: string;
  confidenceScore: number;
  contextualFactors: string[];
  intensity: number;
};
```

### 3.4 Reaction Model

```typescript
type Reaction = {
  id: string;
  contentId: string;
  userId: string;
  type: 'like' | 'empathy' | 'joy' | 'surprise' | 'custom';
  customEmoji?: string;
  message?: string;
  createdAt: Date;
};
```

### 3.5 Memory Collection Model

```typescript
type MemoryCollection = {
  id: string;
  userId: string;
  title: string;
  description: string;
  contentIds: string[]; // References to Content
  createdAt: Date;
  updatedAt: Date;
  generatedBy: 'user' | 'ai';
  theme: string;
};
```

## 4. API Design

### 4.1 Authentication API

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/session
```

### 4.2 User API

```
GET /api/users/me
PUT /api/users/me
GET /api/users/:id
GET /api/users/me/preferences
PUT /api/users/me/preferences
```

### 4.3 Relationship API

```
GET /api/relationships
POST /api/relationships/request
PUT /api/relationships/:id/accept
PUT /api/relationships/:id/reject
DELETE /api/relationships/:id
```

### 4.4 Content API

```
POST /api/content
GET /api/content/feed
GET /api/content/:id
DELETE /api/content/:id
POST /api/content/:id/reaction
DELETE /api/content/:id/reaction/:reactionId
```

### 4.5 Memory API

```
GET /api/memories
GET /api/memories/:id
POST /api/memories
PUT /api/memories/:id
DELETE /api/memories/:id
```

### 4.6 AI Processing API

```
POST /api/ai/analyze-emotion
POST /api/ai/enhance-image
POST /api/ai/suggest-interactions
POST /api/ai/generate-memory
```

### 4.7 Real-Time API

```
WebSocket /api/realtime
Event Types:
- new_content
- new_reaction
- friend_request
- memory_created
```

## 5. UI/UX Considerations

### 5.1 Key User Interfaces

#### 5.1.1 Capture Interface

The capture interface is designed for simplicity and speed, featuring:
- Dual camera preview (front and back)
- Prominent capture button
- Timer countdown for spontaneous moments
- Subtle UI to avoid distracting from the moment
- Toggle between "Pure Real" and "Feel Real" modes

#### 5.1.2 Feed Interface

The feed prioritizes authentic content with:
- Chronological ordering of posts
- Emotional context indicators
- Personalized reaction options
- Minimal distractions or algorithmic filtering
- Intuitive gesture controls for navigation

#### 5.1.3 Memory Journal

The Memory Journal provides an AI-curated experience:
- Thematic collections of past moments
- Contextual storytelling elements
- Interactive timeline navigation
- Shareable collections for close friends
- Emotional journey visualization

### 5.2 Accessibility Considerations

- High contrast mode for visual impairments
- Screen reader compatibility
- Alternative text for AI-generated elements
- Keyboard navigation support
- Customizable text sizing
- Reduced motion option for animations

### 5.3 Performance Optimization

- Progressive loading of media content
- On-device processing for privacy-sensitive operations
- Adaptive quality based on network conditions
- Prefetching of likely interactions based on AI predictions
- Offline mode for viewing previously loaded content

### 5.4 Onboarding Experience

- Guided tour of core features
- Clear explanation of AI enhancement options
- Privacy settings configuration during setup
- Friend connection suggestions to jumpstart engagement
- Sample content to demonstrate the experience

### 5.5 Feedback Mechanisms

- Subtle emotion recognition confidence indicators
- Clear differentiation between original and AI-enhanced content
- User control over AI enhancement levels
- Transparent processing indicators
- Option to report incorrect emotion recognition

## 6. Security and Privacy

### 6.1 Data Protection

- End-to-end encryption for media content
- On-device processing of facial data when possible
- Secure, time-limited storage of raw emotion data
- Clear data retention policies
- User control over AI processing location

### 6.2 Authentication and Authorization

- Multi-factor authentication
- Fine-grained permission model
- Session management with automatic expiration
- Device authorization tracking
- Anomalous login detection

### 6.3 Content Security

- Abuse detection for inappropriate content
- Secure content sharing mechanisms
- Content ownership verification
- Deletion guarantees for user content
- Watermarking of AI-enhanced content

## 7. Deployment and DevOps

### 7.1 CI/CD Pipeline

- GitHub Actions for automated testing and deployment
- Staging environment for pre-production validation
- Feature flags for controlled rollouts
- Automated security scanning
- Performance regression testing

### 7.2 Monitoring and Observability

- Real-time performance monitoring
- Error tracking and alerting
- AI model performance metrics
- User experience analytics
- Resource utilization tracking

### 7.3 Scaling Strategy

- Auto-scaling serverless functions
- Content delivery network for media assets
- Database read replicas for high traffic periods
- AI processing capacity planning
- Cache optimization for frequently accessed content

## 8. Future Considerations

### 8.1 Potential Enhancements

- Additional emotion recognition models for greater cultural diversity
- AR capabilities for enhanced visual effects
- Voice and audio emotion analysis
- Group moments and shared experiences
- Integration with wearable devices for contextual data

### 8.2 Research Areas

- Emotion recognition accuracy across diverse populations
- User perception of AI enhancements
- Impact on authentic social interactions
- Privacy-preserving AI techniques
- Emotional wellbeing effects of the platform
[2025-03-06T09:20:43.790Z] [INFO] [DOCUMENTATION] Generating code.md...
[2025-03-06T09:20:43.790Z] [INFO] [LLM:hnl3z2qtozs] Request to anthropic/claude-3.7-sonnet
[2025-03-06T09:20:43.790Z] [INFO] [LLM:hnl3z2qtozs] LLM Request
[2025-03-06T09:20:43.790Z] [INFO] [LLM:hnl3z2qtozs] Data: 
    You are a technical documentation specialist with expertise in software development.
    
    Generate a comprehensive code.md for a project with the following details:
    
    Project Prompt: 
    
    Tech Stack: {
  "frameworks": [],
  "libraries": [],
  "apis": [],
  "tools": [],
  "documentationLinks": {}
}
    
    Project Content:
    - Overview: 
    - Core Features: 
    - Architecture: # lol: Authentic Moments, Enhanced by AI - Architecture Document

## 1. High-Level System Architecture Overview

The "lol" application is designed as a modern, AI-enhanced social platform that prioritizes authentic interactions while leveraging artificial intelligence to enrich user experiences. The architecture follows a microservices approach with a clear separation of concerns, enabling scalability, maintainability, and resilience.

![High-Level Architecture Diagram](https://mermaid.ink/img/pako:eNqNVMFu2zAM_RWBp7ZAE6dNm16GAVuHAcO2Q7ceuglULcbWIEuGJDfNkH8fZSVOk3bYfLAl8vGRfKQ0QmYlwQSKlVB_pSrRpJrPQTlDvYUfzGizO9pYZ1yLUbQnxW2tLCqjDXrHXWMqNZdO2dJYvBPsm1cGlWTcuXNuLVfCHrjdQcEtXlDJhXLgdMXpQpXIE5ioaFfyOZHmlfDaGfUYx2EYmz2mMNnzCnO0yHMoVMVrVBxAJyVvQOeU9HfnK-yXKOoZlQMbPcbxY5zAZIvPKDSXRtUepFRGT-4rkQvhDfCl0arZgLV9yXiLVbQCGmgdQYMFCo-zRrpF1ihlnwpXZSJiW-WCrVQJE5Fj5XxZnKgpfLsYTmDCcyGUL5bIKFrxktcwEQXwDrXNaXmKRZ-jFBbBZVKKXPDyBaZc1LfKVoKfyYrLaOq5_LpBV5JDlsYdLsNkLUxEYRzZA-Wsd5y7jmH5ByYiN-7Hxbf7p8fvX5fLp_v7L8vl4-PD3fJ-BhNl0YNtlHWZ3yjZWtI_g0mTpGmaNADrOI4u4mQdx0mSxHEaJc04vYjTJr-0-sNyRu_wTZCuWz7Jn0YrXnhw_R7k7LJzWXDXHsJWwmRkdGmVP3Eojm8Oe7UzHnqmj_1vGWxQUlsZbLnDdGBa-lv_ZFVS-tZTD2xRW5UNDKdHdKXRO3YY2Ppz7tpvyDkdCqFLo1UoM2KHvgDyJhSMDt3P1Oj6r-tWXDlbF8NWOXZuRDsYDtbK_1vHQQa7Gg5-FQYdwYT2yP3LwG9-QYo_eLLZCw?type=png)

### Key Architectural Principles:

1. **Serverless-First Approach**: Utilizing serverless technologies to minimize operational overhead and maximize scalability
2. **Edge Computing**: Leveraging edge functions for low-latency AI processing and content delivery
3. **AI-Driven Features**: Integrating multiple AI models for emotion recognition, content enhancement, and personalized interactions
4. **Real-Time Communication**: Enabling seamless, persistent user interactions through durable objects and WebSockets
5. **Privacy-Centric Design**: Processing sensitive data on-device when possible and implementing strict data governance
6. **Extensible Platform**: Building a modular system that can easily incorporate new AI capabilities as they emerge

## 2. Component Breakdown and Responsibilities

### 2.1 Frontend Layer

#### Next.js Application with React Server Components
- **Responsibilities**: 
  - Deliver responsive, accessible UI across devices
  - Handle client-side and server-side rendering
  - Manage application state and user interactions
  - Implement camera access and media capture
  - Process real-time updates from backend services

#### Key Components:
- **Authentication Module**: Handles user registration, login, and session management
- **Capture Interface**: Manages dual-camera access, preview, and capture functionality
- **Feed Component**: Renders friend posts with AI-enhanced elements and interaction options
- **Memory Journal**: Displays AI-curated collections of user's past moments
- **Friend Insights**: Shows AI-generated connection suggestions and relationship insights
- **Settings Panel**: Provides user preference management and privacy controls

### 2.2 Backend Services

#### User Service (Vercel Serverless Functions + Prisma + Neon PostgreSQL)
- **Responsibilities**:
  - Manage user profiles, relationships, and preferences
  - Handle authentication and authorization
  - Process friend requests and social connections
  - Store and retrieve user activity metadata

#### Content Service (Vercel Edge Functions + Upstash Redis + R2 Storage)
- **Responsibilities**:
  - Process and store media uploads
  - Manage content distribution and access control
  - Handle content moderation and filtering
  - Implement content recommendation algorithms
  - Cache frequently accessed content

#### AI Processing Service (Vercel Edge Functions + OpenRouter)
- **Responsibilities**:
  - Coordinate emotion recognition processing
  - Generate visual enhancements based on emotional context
  - Create personalized interaction suggestions
  - Analyze patterns in user content for Memory Journals
  - Route requests to appropriate specialized AI models

#### Real-Time Communication Service (Cloudflare Durable Objects + WebSockets)
- **Responsibilities**:
  - Maintain persistent connections for real-time updates
  - Manage notification delivery
  - Handle live interactions between users
  - Ensure reliable message delivery and ordering

#### Workflow Orchestration Service (Mastra Workflow Engine)
- **Responsibilities**:
  - Coordinate complex multi-step AI processing tasks
  - Manage state for long-running operations
  - Handle retry logic and error recovery
  - Provide observability into processing pipelines

### 2.3 AI Subsystems

#### Emotion Recognition System (TensorFlow.js + Custom Models)
- **Responsibilities**:
  - Analyze facial expressions in captured media
  - Detect environmental context and mood indicators
  - Classify emotional states and confidence levels
  - Provide on-device processing for privacy-sensitive data

#### Visual Enhancement Engine (Custom Generative Models)
- **Responsibilities**:
  - Generate subtle visual elements based on emotional context
  - Apply appropriate style transfers that preserve authenticity
  - Create consistent visual language for emotional expressions
  - Ensure enhancements complement rather than obscure original content

#### Social Context Analyzer (Large Language Models)
- **Responsibilities**:
  - Analyze relationship patterns between users
  - Generate personalized interaction suggestions
  - Create meaningful memory collections
  - Identify potentially significant moments for notifications

## 3. Data Flow Diagrams and Descriptions

### 3.1 Capture Flow

![Capture Flow](https://mermaid.ink/img/pako:eNqVVE1v2zAM_SuETm2BJE7TtL0MGLYdBgzbDt16ECVQsRhbgyQZktwkQ_57KTtx2qTFsINNkY-PfI8UJ8hNRjCBfC3UX6lyNLnmc1DW0G7pD9PatLc21llbYxTtUXFTKoPK6Ba9485YpebSKlMYh3eC_fTKopKMO3vJreVK2AO3OyiYwysquZAWrCk5XagCeQITFe0LPifSvBLOfRPHYRibPaYw2fMSc3TIcyhUyWtUHEBHJW9A55T0d-dL7Jco6hmVBxs9xvFjnMBkiy8oNJdGlR6kVFpP7iqRC-EN8KXRqtmAtX3JeItVtAQaaB1Bg0cUHmeNdIusUco8Fa7KRMRWZYKtVAETkWPpfFmcqCl8vxpOYMJzIZQvlsgoWvKC1zARBfAOtc1oeYpFn6MUFsFlUopc8OIVplzUd8qUgp_JiotoqrnyG7QuI4csjesuDJO1MBGFdWQPlLPecW47huUfmIjcuh8XX--fHr9_WSye7u-_LBaPjw93i_sZTJRBD7ZRxmZ-o2RrSf8MJk2SNE2SBmAdx9FFnKzjOEmSOI2SZpxexGmTX1r9YTmjd_gqSNctH-TPoxEvPLj-DHJ22bksuGsP4VbCZGR0YZQ_cSiObw57tTMeeqaP_W8ZbFBSWxlsucN0YFr6W_9kVVL61lMPbFFblQ0Mp0d0pdE7dhjY-nPu2m_IOR0KoQujVSgzYoe-APImFIwO3c_U6Pqv61ZcWVMVw1Y5dm5EOxgO1sr_W8dBBrsaDn4VBh3BhPbI_cvAb35Bii-4jNhF?type=png)

1. **User Receives Notification**: The app sends a contextual notification based on user patterns and potential meaningful moments.
2. **Camera Activation**: User opens the app and activates the dual-camera system within the 2-minute window.
3. **On-Device Emotion Analysis**: TensorFlow.js performs initial facial expression and context analysis directly on the device.
4. **Capture Processing**:
   - Raw images are temporarily stored
   - Emotion data is sent to the AI Processing Service
   - Visual enhancement options are generated based on emotional context
5. **User Selection**: User toggles between "Pure Real" (unenhanced) and "Feel Real" (AI-enhanced) modes.
6. **Content Storage**: Selected content is encrypted and stored in R2 Storage.
7. **Feed Update**: Content becomes available in friends' feeds with appropriate emotional indicators.

### 3.2 Social Interaction Flow

![Social Interaction Flow](https://mermaid.ink/img/pako:eNqVVMFu2zAM_RWCp7ZAEqdpml4GDFsPBYZth3Y9CBKoWIytQZIMSW6SIf8-yk7sNGmx7WBT5OMj3yPFCTJTEEwgXQn1V6oCTanZHJQ1dLf0h2lt2jsbG2xbYhTtUXFTK4PKmBa9485YpebSKpMbh3eCffPKopKMO3vJreVK2AO3OyiYwysquZAWrKk4XagcWQITFe1zNifSvBLOfRPHYRibPaYw2fMKU3TIMyh0xUtUHEBHJW9A55T0d-cr7Jco6hmVBxs9xvFjnMBkiy8oNJdGlR6k1EZP7iqRC-EN8KXRqtmAtX3JeItVtAIaaB1Bg0cUHmeNdIusUco8Fa7KRMRWZYKtVAETkWPlfFmcqCl8vxpOYMJSIZQvlsgoWvKcFTAROfAOtc1oeYpFn6MUFsFlUopc8PwVplzUd8rkgp_JiotoqrnyG7QuI4csjesuDJO1MBGFdWQPlLPecW47hsUfmIjU2h8XX--fHr9_WSye7u-_LBaPjw93i_sZTJRBD7ZRxmZ-o2RrSf8MJk2SNE2SBmAdx9FFnKzjOEmSOI2SZpxexGmTX1r9YTmjd_gqSNctH-TPoxEvPLj-DHJ22bksuGsP4VbCZGR0bpQ_cSiObw57tTMeeqaP_W8ZbFBSWxlsucN0YFr6W_9kVVL61lMPbFFblQ0Mp0d0pdE7dhjY-nPu2m_IOR0KoXOjVSgzYoe-APImFIwO3c_U6Pqv61ZcWVPnw1Y5dm5EOxgO1sr_W8dBBrsaDn4VBh3BhPbI_cvAb35Bii-eZNi9?type=png)

1. **Content Viewing**: User browses their feed and views a friend's post.
2. **Context Analysis**: AI Processing Service analyzes the relationship context and post content.
3. **Reaction Generation**: System generates personalized reaction options based on:
   - User's communication style
   - Relationship history with the friend
   - Content context and emotional tone
4. **User Interaction**: User selects or customizes a reaction.
5. **Notification Delivery**: Friend receives a real-time notification via Durable Objects.
6. **Relationship Update**: The interaction is recorded to enhance future AI-generated insights.

### 3.3 Memory Journal Generation Flow

![Memory Journal Flow](https://mermaid.ink/img/pako:eNqNVE1v2zAM_SuETu2AJE7TNL0MGLYeBgzbDt16ECVQsRhbgyQZktwkQ_57KTtx2qTFsINNkY-PfI8UJ8hNQTCBdCXUX6kKNKVmc1DW0N3SH6a16d7Z2GBbiVG0R8VNrQwqY1r0jjtjlZpLq0xuHN4J9s0ri0oy7uwlt5YrYQ_c7qBgDq-o5EJasKbidKFyZAlMVLTP2ZxI80o4900ch2Fs9pjCZM8rTNEhz6DQFa9QcQAdlbwBnVPS352vsF-iqGdUHmz0GMePcQKTLb6g0FwaVXqQUhs9uatELoQ3wJdGq2YD1vYl4y1W0QpooDUEDR5ReJw10i2yRinzVLgqExFblQm2UgVMRI6V82VxoqbwfTWcwISlQihfLJFRtOQ5K2AicuAdapvR8hSLPkcpLILLpBS54PkrTLmo75TJBT-TFRfRVHPlN2hdRg5ZGtddG
    
    The code.md should include:
    1. Code examples for key components
    2. Implementation guidelines
    3. Coding patterns and best practices
    4. Testing approach
    5. Deployment considerations
    
    Format the document in Markdown with appropriate headings and code blocks.
  
[2025-03-06T09:20:43.791Z] [INFO] [LLM:hnl3z2qtozs] Using base URL: http://localhost:9000
[LLM API] Received request
[LLM API] Request params: model=anthropic/claude-3.7-sonnet, temp=0.7
[LLM API] Created simple user message
[LLM API] Calling OpenRouter with model: anthropic/claude-3.7-sonnet
 ⚠ Unsupported metadata viewport is configured in metadata export in /bio. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata themeColor is configured in metadata export in /bio. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 GET /bio 200 in 223ms
 ⚠ Unsupported metadata viewport is configured in metadata export in /bio. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata themeColor is configured in metadata export in /bio. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 GET /bio 200 in 1830ms
 GET /projects 200 in 24ms
 ✓ Compiled /_not-found in 408ms (1249 modules)
 ✓ Compiled (1250 modules)
 GET /assets/jobs-demo.mp4 404 in 647ms
 GET /assets/voet-demo.mp4 404 in 690ms
 GET /assets/squish-demo.mp4 404 in 701ms
Found 1 blobs.
Error retrieving tech.md from blob: TypeError: Invalid URL
    at getTechData (src/app/api/tech/route.ts:512:41)
    at async GET (src/app/api/tech/route.ts:282:21)
  510 |     if (mainBlob) {
  511 |       try {
> 512 |         const url = await getDownloadUrl('tech.md');
      |                                         ^
  513 |         const response = await fetch(url);
  514 |         if (response.ok) {
  515 |           techData.main = await response.text(); {
  code: 'ERR_INVALID_URL',
  input: 'tech.md'
}
Successfully retrieved tech data from Vercel Blob
 GET /api/tech 200 in 1366ms
 GET /assets/jobs-demo.mp4 404 in 94ms
 GET /assets/voet-demo.mp4 404 in 95ms
 GET /assets/squish-demo.mp4 404 in 95ms
Found 1 blobs.
Error retrieving tech.md from blob: TypeError: Invalid URL
    at getTechData (src/app/api/tech/route.ts:512:41)
    at async GET (src/app/api/tech/route.ts:282:21)
  510 |     if (mainBlob) {
  511 |       try {
> 512 |         const url = await getDownloadUrl('tech.md');
      |                                         ^
  513 |         const response = await fetch(url);
  514 |         if (response.ok) {
  515 |           techData.main = await response.text(); {
  code: 'ERR_INVALID_URL',
  input: 'tech.md'
}
Successfully retrieved tech data from Vercel Blob
 GET /api/tech 200 in 197ms
 GET /assets/jobs-demo.mp4 404 in 95ms
 GET /assets/voet-demo.mp4 404 in 96ms
 GET /assets/squish-demo.mp4 404 in 97ms
 GET /jobs 200 in 14ms
 ✓ Compiled /api/jobs in 278ms (1289 modules)
prisma:query SELECT "public"."JobPosting"."id", "public"."JobPosting"."title", "public"."JobPosting"."company", "public"."JobPosting"."location", "public"."JobPosting"."type", "public"."JobPosting"."description", "public"."JobPosting"."url", "public"."JobPosting"."source", "public"."JobPosting"."techs", "public"."JobPosting"."salary", "public"."JobPosting"."crawledAt", "public"."JobPosting"."processed", "public"."JobPosting"."matches" FROM "public"."JobPosting" WHERE 1=1 ORDER BY "public"."JobPosting"."crawledAt" DESC OFFSET $1
 GET /api/jobs 200 in 1664ms
prisma:query SELECT "public"."JobPosting"."id", "public"."JobPosting"."title", "public"."JobPosting"."company", "public"."JobPosting"."location", "public"."JobPosting"."type", "public"."JobPosting"."description", "public"."JobPosting"."url", "public"."JobPosting"."source", "public"."JobPosting"."techs", "public"."JobPosting"."salary", "public"."JobPosting"."crawledAt", "public"."JobPosting"."processed", "public"."JobPosting"."matches" FROM "public"."JobPosting" WHERE 1=1 ORDER BY "public"."JobPosting"."crawledAt" DESC OFFSET $1
 GET /api/jobs 200 in 86ms
[LLM API] Success! Response contains 1 choices
 POST /api/llm 200 in 50298ms
[2025-03-06T09:21:34.097Z] [INFO] [LLM:hnl3z2qtozs] Response status: 200
[2025-03-06T09:21:34.097Z] [INFO] [LLM:hnl3z2qtozs] Response length: 14198
[2025-03-06T09:21:34.097Z] [INFO] [LLM:hnl3z2qtozs] LLM Response
[2025-03-06T09:21:34.097Z] [INFO] [LLM:hnl3z2qtozs] Data: # Code Documentation: lol - Authentic Moments, Enhanced by AI

## Table of Contents

1. [Overview](#overview)
2. [Component Implementation](#component-implementation)
   - [Frontend Components](#frontend-components)
   - [Backend Services](#backend-services)
   - [AI Subsystems](#ai-subsystems)
3. [Implementation Guidelines](#implementation-guidelines)
4. [Coding Patterns and Best Practices](#coding-patterns-and-best-practices)
5. [Testing Approach](#testing-approach)
6. [Deployment Considerations](#deployment-considerations)

## Overview

This document provides detailed code implementation guidelines for the "lol" application, a platform designed to capture authentic moments enhanced by AI. The application follows a microservices architecture with a serverless-first approach, leveraging edge computing for AI processing and real-time communication capabilities.

## Component Implementation

### Frontend Components

#### Authentication Module

```tsx
// auth/AuthProvider.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Additional auth methods implementation...

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### Capture Interface

```tsx
// components/capture/DualCameraCapture.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useEmotionDetection } from '@/hooks/useEmotionDetection';
import { CaptureControls } from './CaptureControls';
import { EnhancementToggle } from './EnhancementToggle';

export const DualCameraCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [useEnhancement, setUseEnhancement] = useState(true);
  const [captureComplete, setCaptureComplete] = useState(false);
  const [capturedData, setCapturedData] = useState<CapturedData | null>(null);
  
  const frontCameraRef = useRef<HTMLVideoElement>(null);
  const backCameraRef = useRef<HTMLVideoElement>(null);
  const frontCanvasRef = useRef<HTMLCanvasElement>(null);
  const backCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const { detectEmotion, emotionData } = useEmotionDetection();

  useEffect(() => {
    if (isCapturing) {
      // Initialize camera streams
      const initializeCameras = async () => {
        try {
          // Front camera setup
          const frontStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false
          });
          
          if (frontCameraRef.current) {
            frontCameraRef.current.srcObject = frontStream;
          }
          
          // Back camera setup
          const backStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: false
          });
          
          if (backCameraRef.current) {
            backCameraRef.current.srcObject = backStream;
          }
          
          // Begin emotion detection on front camera
          startEmotionDetection();
        } catch (error) {
          console.error('Error accessing cameras:', error);
          // Handle error state
        }
      };
      
      initializeCameras();
      
      // Set timeout for 2-minute capture window
      const captureTimer = setTimeout(() => {
        if (isCapturing) {
          handleCaptureTimeout();
        }
      }, 120000); // 2 minutes
      
      return () => {
        clearTimeout(captureTimer);
        stopCameraStreams();
      };
    }
  }, [isCapturing]);

  const startEmotionDetection = () => {
    // Run emotion detection at regular intervals
    const detectionInterval = setInterval(() => {
      if (frontCameraRef.current && frontCanvasRef.current && isCapturing) {
        const context = frontCanvasRef.current.getContext('2d');
        if (context) {
          context.drawImage(frontCameraRef.current, 0, 0, 
            frontCanvasRef.current.width, frontCanvasRef.current.height);
          const imageData = context.getImageData(0, 0, 
            frontCanvasRef.current.width, frontCanvasRef.current.height);
          detectEmotion(imageData);
        }
      } else {
        clearInterval(detectionInterval);
      }
    }, 200); // Check emotion every 200ms
    
    return () => clearInterval(detectionInterval);
  };

  const handleCapture = async () => {
    if (!frontCanvasRef.current || !backCanvasRef.current) return;
    
    // Capture from both cameras
    const frontContext = frontCanvasRef.current.getContext('2d');
    const backContext = backCanvasRef.current.getContext('2d');
    
    if (frontContext && backContext && frontCameraRef.current && backCameraRef.current) {
      // Capture front camera
      frontContext.drawImage(frontCameraRef.current, 0, 0, 
        frontCanvasRef.current.width, frontCanvasRef.current.height);
      const frontImage = frontCanvasRef.current.toDataURL('image/jpeg');
      
      // Capture back camera
      backContext.drawImage(backCameraRef.current, 0, 0, 
        backCanvasRef.current.width, backCanvasRef.current.height);
      const backImage = backCanvasRef.current.toDataURL('image/jpeg');
      
      // Process capture
      await processCapturedImages(frontImage, backImage, emotionData);
    }
  };

  const processCapturedImages = async (frontImage: string, backImage: string, emotionData: any) => {
    setIsCapturing(false);
    setCaptureComplete(true);
    
    try {
      // Upload images and emotion data to backend
      const response = await fetch('/api/moments/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frontImage,
          backImage,
          emotionData,
          useEnhancement
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to process capture');
      }
      
      const data = await response.json();
      setCapturedData(data);
      
      // Navigate to preview or publish screen
      // router.push('/moments/preview/' + data.captureId);
    } catch (error) {
      console.error('Error processing capture:', error);
      // Handle error state
    }
  };

  // Additional methods for handling capture flow...

  return (
    <div className="capture-container">
      {isCapturing ? (
        <>
          <div className="cameras-container">
            <div className="camera-view front-camera">
              <video ref={frontCameraRef} autoPlay playsInline muted />
              <canvas ref={frontCanvasRef} width="640" height="480" className="hidden" />
            </div>
            <div className="camera-view back-camera">
              <video ref={backCameraRef} autoPlay playsInline muted />
              <canvas ref={backCanvasRef} width="640" height="480" className="hidden" />
            </div>
          </div>
          
          <div className="capture-controls">
            <CaptureControls onCapture={handleCapture} onCancel={() => setIsCapturing(false)} />
            <EnhancementToggle 
              useEnhancement={useEnhancement} 
              setUseEnhancement={setUseEnhancement} 
            />
            {emotionData && (
              <div className="emotion-indicator">
                Detected: {emotionData.primaryEmotion}
              </div>
            )}
          </div>
        </>
      ) : captureComplete ? (
        <div className="capture-complete">
          <h2>Moment Captured!</h2>
          {/* Display capture preview or processing indicator */}
        </div>
      ) : (
        <div className="start-capture">
          <button 
            className="start-capture-btn"
            onClick={() => setIsCapturing(true)}
          >
            Capture Moment
          </button>
        </div>
      )}
    </div>
  );
};
```

#### Feed Component

```tsx
// components/feed/MomentsFeed.tsx
'use client';

import { useState, useEffect } from 'react';
import { MomentCard } from './MomentCard';
import { useMomentSubscription } from '@/hooks/useMomentSubscription';
import { Moment } from '@/types/moment';

interface MomentsFeedProps {
  initialMoments?: Moment[];
}

export const MomentsFeed = ({ initialMoments = [] }: MomentsFeedProps) => {
  const [moments, setMoments] = useState<Moment[]>(initialMoments);
  const [isLoading, setIsLoading] = useState(!initialMoments.length);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Subscribe to real-time updates for new moments
  const { newMoments } = useMomentSubscription();
  
  useEffect(() => {
    if (newMoments) {
      // Add new moments to the beginning of the feed
      setMoments(prev => [newMoments, ...prev]);
    }
  }, [newMoments]);
  
  useEffect(() => {
    if (!initialMoments.length) {
      fetchMoments();
    }
  }, []);
  
  const fetchMoments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/moments/feed?page=${page}&limit=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch moments');
      }
      
      const data = await response.json();
      
      if (data.moments.length === 0) {
        setHasMore(false);
      } else {
        setMoments(prev => [...prev, ...data.moments]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching moments:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMomentReaction = async (momentId: string, reactionType: string) => {
    try {
      const response = await fetch(`/api/moments/${momentId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add reaction');
      }
      
      // Update the local state to reflect the new reaction
      setMoments(prev => 
        prev.map(moment => 
          moment.id === momentId 
            ? { 
                ...moment, 
                reactions: [...moment.reactions, { type: reactionType, userId: 'currentUser' }] 
              } 
            : moment
        )
      );
    } catch (error) {
      console.error('Error reacting to moment:', error);
    }
  };
  
  return (
    <div className="moments-feed">
      {moments.map(moment => (
        <MomentCard 
          key={moment.id} 
          moment={moment} 
          onReaction={handleMomentReaction} 
        />
      ))}
      
      {isLoading && (
        <div className="loading-indicator">
          <p>Loading moments...</p>
        </div>
      )}
      
      {!isLoading && hasMore && (
        <button 
          className="load-more-btn" 
          onClick={fetchMoments}
        >
          Load More
        </button>
      )}
      
      {!isLoading && !hasMore && moments.length === 0 && (
        <div className="empty-feed">
          <p>No moments yet. Connect with friends to see their authentic moments.</p>
        </div>
      )}
    </div>
  );
};
```

### Backend Services

#### User Service (Vercel Serverless Function)

```typescript
// pages/api/users/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Authenticate request
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const user = await prisma.user.findUnique({
          where: { id },
          include: {
            profile: true,
            // Only include non-sensitive friend data
            friends: {
              select: {
                id: true,
                name: true,
                image: true,
                profile: {
                  select: {
                    bio: true,
                  }
                }
              }
            }
          }
        });

        if (!user) {
          return res.status(404).json({ error:
[2025-03-06T09:21:34.098Z] [INFO] [TECH_DOCS] Generating tech documentation...
Original techStack structure: {
  "frameworks": [],
  "libraries": [],
  "apis": [],
  "tools": [],
  "documentationLinks": {}
}
Formatted techStack structure: {
  "frameworks": [],
  "libraries": [],
  "apis": [],
  "tools": [],
  "documentationLinks": {}
}
[2025-03-06T09:21:34.098Z] [INFO] [TECH_DOCS] Extracted 0 links from search results
[2025-03-06T09:21:34.098Z] [INFO] [TECH_DOCS] Processing 0 tech URLs: []
[2025-03-06T09:21:34.098Z] [INFO] [TECH_DOCS] No content fetched, generating basic tech.md
[2025-03-06T09:21:34.098Z] [INFO] [TECH_DOCS] Generating basic tech docs without URL content
[2025-03-06T09:21:34.098Z] [INFO] [TECH_DOCS_LLM] LLM Request
[2025-03-06T09:21:34.098Z] [INFO] [TECH_DOCS_LLM] Data: 
      You are a technical documentation specialist.
      
      Generate a comprehensive tech.md document for a project with the following technology stack:
      {
  "frameworks": [],
  "libraries": [],
  "apis": [],
  "tools": [],
  "documentationLinks": {}
}
      
      The tech.md should include:
      1. Overview of the technology stack
      2. Key components and their purposes
      3. How the technologies work together
      4. Best practices for implementation
      5. Useful resources and links
      
      Format the document in Markdown with appropriate headings and code blocks.
      Use your knowledge to provide accurate and helpful information about each technology.
    
[2025-03-06T09:21:34.098Z] [INFO] [LLM:i06ggwfo1p] Request to anthropic/claude-3.7-sonnet
[2025-03-06T09:21:34.098Z] [INFO] [LLM:i06ggwfo1p] LLM Request
[2025-03-06T09:21:34.098Z] [INFO] [LLM:i06ggwfo1p] Data: 
      You are a technical documentation specialist.
      
      Generate a comprehensive tech.md document for a project with the following technology stack:
      {
  "frameworks": [],
  "libraries": [],
  "apis": [],
  "tools": [],
  "documentationLinks": {}
}
      
      The tech.md should include:
      1. Overview of the technology stack
      2. Key components and their purposes
      3. How the technologies work together
      4. Best practices for implementation
      5. Useful resources and links
      
      Format the document in Markdown with appropriate headings and code blocks.
      Use your knowledge to provide accurate and helpful information about each technology.
    
[2025-03-06T09:21:34.098Z] [INFO] [LLM:i06ggwfo1p] Using base URL: http://localhost:9000
[LLM API] Received request
[LLM API] Request params: model=anthropic/claude-3.7-sonnet, temp=0.7
[LLM API] Created simple user message
[LLM API] Calling OpenRouter with model: anthropic/claude-3.7-sonnet
[LLM API] Success! Response contains 1 choices
 POST /api/llm 200 in 8355ms
[2025-03-06T09:21:42.460Z] [INFO] [LLM:i06ggwfo1p] Response status: 200
[2025-03-06T09:21:42.460Z] [INFO] [LLM:i06ggwfo1p] Response length: 2589
[2025-03-06T09:21:42.460Z] [INFO] [LLM:i06ggwfo1p] LLM Response
[2025-03-06T09:21:42.460Z] [INFO] [LLM:i06ggwfo1p] Data: # Technology Stack Documentation

## Overview of the Technology Stack

This project currently does not have any defined frameworks, libraries, APIs, or tools. This document serves as a template for documenting your technology stack once you've made technology decisions for your project.

## Key Components and Their Purposes

When defining your technology stack, consider including the following components:

### Frameworks
Frameworks provide a structured foundation for your application, offering pre-built components and architectural patterns.

### Libraries
Libraries are collections of pre-written code that provide specific functionality without dictating application structure.

### APIs
APIs (Application Programming Interfaces) allow your application to interact with external services and data sources.

### Tools
Development, testing, and deployment tools that support your development workflow.

## How Technologies Work Together

When selecting technologies for your stack, consider:

1. **Compatibility**: Ensure all components can work together without conflicts
2. **Performance**: Evaluate how the combined technologies affect application performance
3. **Maintainability**: Consider long-term support and community activity for each technology
4. **Learning Curve**: Balance using cutting-edge technologies with team expertise

## Best Practices for Implementation

### Technology Selection
- Choose technologies based on project requirements, not trends
- Consider team expertise when selecting technologies
- Evaluate the maturity and community support of each technology
- Assess licensing implications

### Documentation
- Document why specific technologies were chosen
- Maintain up-to-date dependency information
- Document setup procedures for new team members
- Include links to official documentation

### Dependency Management
- Use a dependency management system
- Regularly update dependencies for security patches
- Lock dependency versions for production builds
- Consider the impact of transitive dependencies

### Security Considerations
- Review security implications of each technology
- Follow security best practices for each component
- Regularly update components to address security vulnerabilities

## Useful Resources and Links

When you select technologies for your project, include links to:

- Official documentation
- Getting started guides
- Community forums
- Tutorials and examples
- GitHub repositories
- Security advisories

---

**Note**: This document should be updated as technologies are added to or removed from your project stack.
[2025-03-06T09:21:42.462Z] [INFO] [TECH_DOCS_LLM] LLM Response
[2025-03-06T09:21:42.462Z] [INFO] [TECH_DOCS_LLM] Data: # Technology Stack Documentation

## Overview of the Technology Stack

This project currently does not have any defined frameworks, libraries, APIs, or tools. This document serves as a template for documenting your technology stack once you've made technology decisions for your project.

## Key Components and Their Purposes

When defining your technology stack, consider including the following components:

### Frameworks
Frameworks provide a structured foundation for your application, offering pre-built components and architectural patterns.

### Libraries
Libraries are collections of pre-written code that provide specific functionality without dictating application structure.

### APIs
APIs (Application Programming Interfaces) allow your application to interact with external services and data sources.

### Tools
Development, testing, and deployment tools that support your development workflow.

## How Technologies Work Together

When selecting technologies for your stack, consider:

1. **Compatibility**: Ensure all components can work together without conflicts
2. **Performance**: Evaluate how the combined technologies affect application performance
3. **Maintainability**: Consider long-term support and community activity for each technology
4. **Learning Curve**: Balance using cutting-edge technologies with team expertise

## Best Practices for Implementation

### Technology Selection
- Choose technologies based on project requirements, not trends
- Consider team expertise when selecting technologies
- Evaluate the maturity and community support of each technology
- Assess licensing implications

### Documentation
- Document why specific technologies were chosen
- Maintain up-to-date dependency information
- Document setup procedures for new team members
- Include links to official documentation

### Dependency Management
- Use a dependency management system
- Regularly update dependencies for security patches
- Lock dependency versions for production builds
- Consider the impact of transitive dependencies

### Security Considerations
- Review security implications of each technology
- Follow security best practices for each component
- Regularly update components to address security vulnerabilities

## Useful Resources and Links

When you select technologies for your project, include links to:

- Official documentation
- Getting started guides
- Community forums
- Tutorials and examples
- GitHub repositories
- Security advisories

---

**Note**: This document should be updated as technologies are added to or removed from your project stack.
[2025-03-06T09:21:42.463Z] [INFO] [PROJECT_GEN] Generating init.md...
[2025-03-06T09:21:42.464Z] [INFO] [LLM:j1g3grg1yz] Structured Request to anthropic/claude-3.7-sonnet
[2025-03-06T09:21:42.464Z] [INFO] [LLM:j1g3grg1yz] LLM Request
[2025-03-06T09:21:42.464Z] [INFO] [LLM:j1g3grg1yz] Data: 
  You are an expert software engineering workflow architect.
  Given the following project details and tech stack, determine the essential command prompts
  that should be created to guide developers through common workflows for this project.
  
  PROJECT NAME: lol
  
  PROJECT DESCRIPTION: 
  # **lol: Authentic Moments, Enhanced by AI**

> *A social app that uses AI to create genuine, expressive interactions between friends without the pressure of perfect posts.*

## Concept Overview
lol reimagines the authenticity movement pioneered by BeReal, addressing the platform's declining engagement by introducing AI-powered features that enhance genuine social connections rather than replacing them. The app maintains the core "2-minute window" for posting unfiltered content from both cameras but adds AI companions that help users express themselves, analyze emotional contexts, and create meaningful interactions with friends. 

Targeting Gen Z and Alpha users (16-25 as the primary demographic), lol taps into the proven desire for authentic social media while solving the "mundane content problem" that has plagued BeReal. By 2025, with ATT opt-in rates reaching 35% and AI integration becoming standard (88% of marketers using AI daily), the timing is perfect for a platform that thoughtfully combines authenticity with AI enhancement.

## Core Features

* **Emotion-Enhanced Captures**: The dual-camera system analyzes facial expressions and environmental context, subtly enhancing the mood of photos through AI-generated visual elements (like weather effects that match your emotional state) while preserving the authentic moment.

* **AI Memory Journals**: The app creates private, personalized memory collections by recognizing patterns in your daily posts, helping you appreciate the evolution of your routines, relationships, and environments over time.

* **Contextual Prompts**: Unlike BeReal's generic notification, AI analyzes your typical daily patterns and sends notifications during potentially meaningful moments (significant location changes, gatherings with friends, or unusual activities).

* **Friend Insights**: An AI companion analyzes mutual interactions and suggests meaningful ways to engage with friends based on their recent posts, moods, and shared experiences, deepening connections beyond superficial likes.

* **Authentic Reactions**: Replace generic emoji reactions with AI-generated personalized responses that match your speaking style and relationship with each friend, making digital interactions feel more genuine.

## User Experience

lol maintains a minimalist, monochromatic interface with intuitive gestures that emphasize content over UI. The daily notification prompts users to capture their moment within 2 minutes, but the AI-enhanced camera subtly detects emotions and environmental context to add gentle visual enhancements that amplify the mood without filtering reality. Users can toggle between "Pure Real" (unenhanced) and "Feel Real" (AI-enhanced) modes.

The social feed shows friends' daily moments with their emotion indicators, and tapping on posts reveals AI-suggested personal responses based on your relationship history. The Memory Journal provides a private space where users can see AI-curated collections of their own moments, organized by emotional patterns, locations, or significant life changes detected over time.

## Technical Implementation

The app leverages Next.js with React Server Components for the frontend and Vercel Edge Functions for real-time AI processing. The core architecture includes:

1. **Durable Objects** for maintaining stateful chat rooms and user sessions, eliminating the connection issues that plagued BeReal
2. **OpenRouter integration** for accessing multiple AI models specialized in emotion recognition and content generation
3. **Upstash Redis** for fast, serverless data storage of user interactions and preferences
4. **Neon PostgreSQL** for structured data and relationship mapping between users
5. **Mastra workflow engine** for orchestrating complex AI analysis tasks across multiple services

The dual-camera capture system uses TensorFlow.js for on-device emotion analysis before sending data to more powerful server-side models for enhancement generation.

## Go-To-Market Strategy

Launch strategy centers on university campuses with a "Friend Circles" approach – users can only join if invited by 3+ existing members, creating trusted networks from the start. The app will leverage the "2-minute authenticity window" as a shareable moment, encouraging users to post their lol captures to other platforms with "This is how I really felt" messaging.

Growth will be driven by weekly AI-generated "Friendship Stories" that highlight meaningful connections between users and can be shared externally. Partnerships with mental health organizations will position the app as promoting digital well-being through authentic expression rather than performance.

## Resources & Inspiration

* [Reliable UX for AI Chat with Durable Objects](https://sunilpai.dev/posts/reliable-ux-for-ai-chat-with-durable-objects/) – Essential architecture for creating persistent, reliable real-time experiences without the disconnection issues that plagued BeReal.

* [Mastra Workflow Engine](https://github.com/zackees/mastra) – Provides the sophisticated state management needed for complex AI analysis of emotions and social contexts.

* [Priompt](https://github.com/anysphere/priompt) – JSX-based prompt design library perfect for creating the contextual, personalized AI interactions central to the app.

* [Emotion AI in Mobile Apps](https://www.affectiva.com/emotion-ai-overview) – Implementation frameworks for the facial expression recognition that powers the emotional enhancement features.

* [BeReal's Success Factors Analysis](https://www.businessofapps.com/data/bereal-statistics/) – Comprehensive understanding of what worked (and what didn't) in BeReal's approach to authentic social media.

* [Gen Alpha and Gen Z AI Companions](https://www.gartner.com/en/articles/what-gen-z-and-millennials-want-from-generative-ai) – Research on how younger generations interact with AI companions, showing preference for empathetic, playful interactions.

* [Upstash + Next.js Integration](https://github.com/upstash/jstack) – Optimal patterns for building low-cost serverless apps with Redis KV storage and Next.js.
  
  TECH STACK:
  {
  "frameworks": [
    "next.js",
    "react"
  ],
  "libraries": [
    "tailwindcss",
    "framer-motion",
    "shadcn-ui",
    "react-query"
  ],
  "apis": [
    "restful",
    "graphql"
  ],
  "tools": [
    "typescript",
    "eslint",
    "prisma"
  ],
  "documentationLinks": {
    "next.js": "https://nextjs.org/",
    "react": "https://reactjs.org/",
    "tailwindcss": "https://tailwindcss.com/",
    "framer-motion": "https://www.framer.com/motion/",
    "shadcn-ui": "https://ui.shadcn.com/",
    "react-query": "https://tanstack.com/query/latest",
    "graphql": "https://graphql.org/",
    "restful": "https://restfulapi.net/",
    "typescript": "https://www.typescriptlang.org/",
    "eslint": "https://eslint.org/",
    "prisma": "https://www.prisma.io/"
  }
}
  
  RESEARCH CONTEXT:
  ... (truncated)
  
  For each command prompt:
  1. Provide a filename (e.g., "database-migrations.md")
  2. Explain why this prompt is necessary for this project
  3. Outline the key sections and commands that should be included
  4. Note any tech stack-specific considerations
  
  Output your response as valid JSON in the following format:
  {
    "baseCommandPrompts": [
      {
        "filename": "setup.md",
        "rationale": "...",
        "sections": ["...", "..."],
        "techConsiderations": "..."
      },
      ...
    ],
    "projectSpecificPrompts": [
      {
        "filename": "custom-workflow.md",
        "rationale": "...",
        "sections": ["...", "..."],
        "techConsiderations": "..."
      },
      ...
    ]
  }

[2025-03-06T09:21:42.464Z] [INFO] [LLM:x324sfczuxo] Request to anthropic/claude-3.7-sonnet
[2025-03-06T09:21:42.464Z] [INFO] [LLM:x324sfczuxo] LLM Request
[2025-03-06T09:21:42.464Z] [INFO] [LLM:x324sfczuxo] Data: 
  You are an expert software engineering workflow architect.
  Given the following project details and tech stack, determine the essential command prompts
  that should be created to guide developers through common workflows for this project.
  
  PROJECT NAME: lol
  
  PROJECT DESCRIPTION: 
  # **lol: Authentic Moments, Enhanced by AI**

> *A social app that uses AI to create genuine, expressive interactions between friends without the pressure of perfect posts.*

## Concept Overview
lol reimagines the authenticity movement pioneered by BeReal, addressing the platform's declining engagement by introducing AI-powered features that enhance genuine social connections rather than replacing them. The app maintains the core "2-minute window" for posting unfiltered content from both cameras but adds AI companions that help users express themselves, analyze emotional contexts, and create meaningful interactions with friends. 

Targeting Gen Z and Alpha users (16-25 as the primary demographic), lol taps into the proven desire for authentic social media while solving the "mundane content problem" that has plagued BeReal. By 2025, with ATT opt-in rates reaching 35% and AI integration becoming standard (88% of marketers using AI daily), the timing is perfect for a platform that thoughtfully combines authenticity with AI enhancement.

## Core Features

* **Emotion-Enhanced Captures**: The dual-camera system analyzes facial expressions and environmental context, subtly enhancing the mood of photos through AI-generated visual elements (like weather effects that match your emotional state) while preserving the authentic moment.

* **AI Memory Journals**: The app creates private, personalized memory collections by recognizing patterns in your daily posts, helping you appreciate the evolution of your routines, relationships, and environments over time.

* **Contextual Prompts**: Unlike BeReal's generic notification, AI analyzes your typical daily patterns and sends notifications during potentially meaningful moments (significant location changes, gatherings with friends, or unusual activities).

* **Friend Insights**: An AI companion analyzes mutual interactions and suggests meaningful ways to engage with friends based on their recent posts, moods, and shared experiences, deepening connections beyond superficial likes.

* **Authentic Reactions**: Replace generic emoji reactions with AI-generated personalized responses that match your speaking style and relationship with each friend, making digital interactions feel more genuine.

## User Experience

lol maintains a minimalist, monochromatic interface with intuitive gestures that emphasize content over UI. The daily notification prompts users to capture their moment within 2 minutes, but the AI-enhanced camera subtly detects emotions and environmental context to add gentle visual enhancements that amplify the mood without filtering reality. Users can toggle between "Pure Real" (unenhanced) and "Feel Real" (AI-enhanced) modes.

The social feed shows friends' daily moments with their emotion indicators, and tapping on posts reveals AI-suggested personal responses based on your relationship history. The Memory Journal provides a private space where users can see AI-curated collections of their own moments, organized by emotional patterns, locations, or significant life changes detected over time.

## Technical Implementation

The app leverages Next.js with React Server Components for the frontend and Vercel Edge Functions for real-time AI processing. The core architecture includes:

1. **Durable Objects** for maintaining stateful chat rooms and user sessions, eliminating the connection issues that plagued BeReal
2. **OpenRouter integration** for accessing multiple AI models specialized in emotion recognition and content generation
3. **Upstash Redis** for fast, serverless data storage of user interactions and preferences
4. **Neon PostgreSQL** for structured data and relationship mapping between users
5. **Mastra workflow engine** for orchestrating complex AI analysis tasks across multiple services

The dual-camera capture system uses TensorFlow.js for on-device emotion analysis before sending data to more powerful server-side models for enhancement generation.

## Go-To-Market Strategy

Launch strategy centers on university campuses with a "Friend Circles" approach – users can only join if invited by 3+ existing members, creating trusted networks from the start. The app will leverage the "2-minute authenticity window" as a shareable moment, encouraging users to post their lol captures to other platforms with "This is how I really felt" messaging.

Growth will be driven by weekly AI-generated "Friendship Stories" that highlight meaningful connections between users and can be shared externally. Partnerships with mental health organizations will position the app as promoting digital well-being through authentic expression rather than performance.

## Resources & Inspiration

* [Reliable UX for AI Chat with Durable Objects](https://sunilpai.dev/posts/reliable-ux-for-ai-chat-with-durable-objects/) – Essential architecture for creating persistent, reliable real-time experiences without the disconnection issues that plagued BeReal.

* [Mastra Workflow Engine](https://github.com/zackees/mastra) – Provides the sophisticated state management needed for complex AI analysis of emotions and social contexts.

* [Priompt](https://github.com/anysphere/priompt) – JSX-based prompt design library perfect for creating the contextual, personalized AI interactions central to the app.

* [Emotion AI in Mobile Apps](https://www.affectiva.com/emotion-ai-overview) – Implementation frameworks for the facial expression recognition that powers the emotional enhancement features.

* [BeReal's Success Factors Analysis](https://www.businessofapps.com/data/bereal-statistics/) – Comprehensive understanding of what worked (and what didn't) in BeReal's approach to authentic social media.

* [Gen Alpha and Gen Z AI Companions](https://www.gartner.com/en/articles/what-gen-z-and-millennials-want-from-generative-ai) – Research on how younger generations interact with AI companions, showing preference for empathetic, playful interactions.

* [Upstash + Next.js Integration](https://github.com/upstash/jstack) – Optimal patterns for building low-cost serverless apps with Redis KV storage and Next.js.
  
  TECH STACK:
  {
  "frameworks": [
    "next.js",
    "react"
  ],
  "libraries": [
    "tailwindcss",
    "framer-motion",
    "shadcn-ui",
    "react-query"
  ],
  "apis": [
    "restful",
    "graphql"
  ],
  "tools": [
    "typescript",
    "eslint",
    "prisma"
  ],
  "documentationLinks": {
    "next.js": "https://nextjs.org/",
    "react": "https://reactjs.org/",
    "tailwindcss": "https://tailwindcss.com/",
    "framer-motion": "https://www.framer.com/motion/",
    "shadcn-ui": "https://ui.shadcn.com/",
    "react-query": "https://tanstack.com/query/latest",
    "graphql": "https://graphql.org/",
    "restful": "https://restfulapi.net/",
    "typescript": "https://www.typescriptlang.org/",
    "eslint": "https://eslint.org/",
    "prisma": "https://www.prisma.io/"
  }
}
  
  RESEARCH CONTEXT:
  ... (truncated)
  
  For each command prompt:
  1. Provide a filename (e.g., "database-migrations.md")
  2. Explain why this prompt is necessary for this project
  3. Outline the key sections and commands that should be included
  4. Note any tech stack-specific considerations
  
  Output your response as valid JSON in the following format:
  {
    "baseCommandPrompts": [
      {
        "filename": "setup.md",
        "rationale": "...",
        "sections": ["...", "..."],
        "techConsiderations": "..."
      },
      ...
    ],
    "projectSpecificPrompts": [
      {
        "filename": "custom-workflow.md",
        "rationale": "...",
        "sections": ["...", "..."],
        "techConsiderations": "..."
      },
      ...
    ]
  }

[2025-03-06T09:21:42.465Z] [INFO] [LLM:x324sfczuxo] Using base URL: http://localhost:9000
[LLM API] Received request
[LLM API] Request params: model=anthropic/claude-3.7-sonnet, temp=0.7
[LLM API] Created JSON-formatted messages with stronger system prompt
[LLM API] Calling OpenRouter with model: anthropic/claude-3.7-sonnet
[LLM API] Success! Response contains 1 choices
 POST /api/llm 200 in 32578ms
[2025-03-06T09:22:15.055Z] [INFO] [LLM:x324sfczuxo] Response status: 200
[2025-03-06T09:22:15.055Z] [INFO] [LLM:x324sfczuxo] Response length: 8787
[2025-03-06T09:22:15.055Z] [INFO] [LLM:x324sfczuxo] LLM Response
[2025-03-06T09:22:15.055Z] [INFO] [LLM:x324sfczuxo] Data: {
  "baseCommandPrompts": [
    {
      "filename": "project-setup.md",
      "rationale": "Developers need a clear guide to set up the project environment with all required dependencies and configurations for the Next.js application with TypeScript, Tailwind CSS, and other libraries.",
      "sections": [
        "Prerequisites (Node.js, npm/yarn/pnpm)",
        "Repository setup and cloning",
        "Environment configuration (.env setup)",
        "Installing dependencies",
        "Development server commands",
        "TypeScript configuration",
        "ESLint and code quality setup"
      ],
      "techConsiderations": "Ensure Next.js 14+ compatibility with React Server Components and specify the correct package manager (npm, yarn, pnpm) to maintain consistency across the development team."
    },
    {
      "filename": "database-management.md",
      "rationale": "The application relies on Prisma ORM for database operations with both Neon PostgreSQL and Upstash Redis, requiring clear instructions for schema management, migrations, and data operations.",
      "sections": [
        "Prisma schema overview",
        "Database connection setup for PostgreSQL and Redis",
        "Creating and running migrations",
        "Seeding test data",
        "Common query patterns",
        "Database reset and troubleshooting",
        "Production database considerations"
      ],
      "techConsiderations": "Include specific commands for both Neon PostgreSQL and Upstash Redis integration, and explain how to use Prisma with multiple databases for different data types (relational vs. key-value)."
    },
    {
      "filename": "component-development.md",
      "rationale": "Provides guidelines for creating and testing UI components using React, shadcn/ui, Tailwind CSS, and Framer Motion to maintain consistency across the application.",
      "sections": [
        "Component architecture overview",
        "Setting up new shadcn/ui components",
        "Styling with Tailwind CSS",
        "Animation patterns with Framer Motion",
        "Component testing",
        "Storybook integration (if applicable)",
        "Accessibility considerations"
      ],
      "techConsiderations": "Focus on the integration between shadcn/ui, Tailwind CSS, and Framer Motion, with particular attention to performance optimization for animations on mobile devices."
    },
    {
      "filename": "api-development.md",
      "rationale": "Developers need clear guidance on implementing and consuming both RESTful and GraphQL APIs, including authentication, error handling, and data validation.",
      "sections": [
        "API architecture overview",
        "Creating Next.js API routes",
        "GraphQL schema and resolver setup",
        "Authentication and authorization",
        "Error handling patterns",
        "Request validation",
        "Testing API endpoints",
        "React Query integration for data fetching"
      ],
      "techConsiderations": "Provide examples for both REST and GraphQL implementations, with specific focus on React Query for client-side data management and caching strategies."
    },
    {
      "filename": "deployment-workflow.md",
      "rationale": "Standardized deployment processes are essential for consistent releases across environments, particularly with the Next.js and Vercel Edge Functions architecture.",
      "sections": [
        "Environment configuration management",
        "Vercel deployment setup",
        "Environment variables management",
        "Continuous Integration workflow",
        "Preview deployments",
        "Production deployment checklist",
        "Rollback procedures",
        "Monitoring and logging"
      ],
      "techConsiderations": "Focus on Vercel-specific deployment configurations, Edge Functions setup, and environment-specific optimizations for the Next.js application."
    }
  ],
  "projectSpecificPrompts": [
    {
      "filename": "ai-integration.md",
      "rationale": "The core value proposition of lol is AI-enhanced social interactions, requiring clear documentation on integrating and configuring various AI services for emotion recognition, content generation, and contextual analysis.",
      "sections": [
        "AI architecture overview",
        "OpenRouter API integration",
        "TensorFlow.js setup for on-device emotion analysis",
        "Server-side AI model configuration",
        "Emotion recognition implementation",
        "Content enhancement workflows",
        "AI memory journal generation",
        "Testing and tuning AI features",
        "Privacy considerations for AI data"
      ],
      "techConsiderations": "Include specific integration patterns for TensorFlow.js in a Next.js application, and how to optimize AI processing between client and server using React Server Components."
    },
    {
      "filename": "camera-system.md",
      "rationale": "The dual-camera capture system is a fundamental feature that requires specialized implementation for capturing, processing, and enhancing photos with emotion recognition.",
      "sections": [
        "Camera API implementation",
        "Dual-camera capture workflow",
        "On-device image processing",
        "Emotion detection integration",
        "AI enhancement pipeline",
        "Performance optimization for mobile devices",
        "Camera permissions handling",
        "Fallback strategies for unsupported devices"
      ],
      "techConsiderations": "Focus on browser compatibility issues with camera APIs, performance considerations for real-time processing with TensorFlow.js, and integration with the AI enhancement pipeline."
    },
    {
      "filename": "realtime-features.md",
      "rationale": "The application requires robust real-time features for notifications, friend activities, and interactions, leveraging Durable Objects for stateful connections.",
      "sections": [
        "Durable Objects architecture overview",
        "Setting up persistent connections",
        "Real-time notification system",
        "Friend activity streams",
        "Chat and interaction implementation",
        "State synchronization patterns",
        "Handling network disruptions",
        "Testing real-time features"
      ],
      "techConsiderations": "Provide detailed implementation patterns for Durable Objects with Next.js and Vercel, focusing on connection reliability and state management across devices."
    },
    {
      "filename": "workflow-engine.md",
      "rationale": "The Mastra workflow engine is used for orchestrating complex AI analysis tasks and requires specific implementation guidance for developers.",
      "sections": [
        "Mastra workflow engine setup",
        "Defining AI analysis workflows",
        "Emotion recognition pipeline",
        "Memory journal generation workflow",
        "Friend insights generation",
        "Error handling and retries",
        "Monitoring workflow execution",
        "Testing and debugging workflows"
      ],
      "techConsiderations": "Include specific examples of how to integrate Mastra with the Next.js application architecture and how to optimize for serverless execution environments."
    },
    {
      "filename": "privacy-security.md",
      "rationale": "Given the sensitive nature of emotion data, facial recognition, and social interactions, comprehensive privacy and security measures are essential.",
      "sections": [
        "Data privacy architecture",
        "User consent management",
        "Emotion data handling policies",
        "Image processing privacy safeguards",
        "Friend network security",
        "Data retention and deletion workflows",
        "Compliance considerations (GDPR, CCPA)",
        "Security testing procedures"
      ],
      "techConsiderations": "Focus on implementing privacy by design principles in the Next.js application, secure data handling with Prisma, and proper encryption for sensitive user data."
    },
    {
      "filename": "prompt-engineering.md",
      "rationale": "The application relies heavily on AI prompts for personalized interactions, requiring standardized approaches to prompt design and management using Priompt.",
      "sections": [
        "Priompt JSX integration",
        "Prompt template management",
        "Contextual prompt generation",
        "Personalization variables",
        "Emotion-aware prompt design",
        "Testing and evaluating prompt effectiveness",
        "Versioning and improving prompts",
        "Prompt security considerations"
      ],
      "techConsiderations": "Provide examples of integrating Priompt's JSX-based prompt design with the Next.js and React application architecture, including state management for dynamic prompts."
    }
  ]
}
[2025-03-06T09:22:15.056Z] [INFO] [LLM:j1g3grg1yz] Structured Response received
[2025-03-06T09:22:15.057Z] [INFO] [LLM:lki613jhrs9] Request to anthropic/claude-3.7-sonnet
[2025-03-06T09:22:15.057Z] [INFO] [LLM:lki613jhrs9] LLM Request
[2025-03-06T09:22:15.057Z] [INFO] [LLM:lki613jhrs9] Data: 
  You are an expert software engineering workflow architect.
  Create a detailed setup command prompt to guide developers through setting up the project from scratch.
  
  PROJECT NAME: lol
  
  PROJECT DESCRIPTION: 
  # **lol: Authentic Moments, Enhanced by AI**

> *A social app that uses AI to create genuine, expressive interactions between friends without the pressure of perfect posts.*

## Concept Overview
lol reimagines the authenticity movement pioneered by BeReal, addressing the platform's declining engagement by introducing AI-powered features that enhance genuine social connections rather than replacing them. The app maintains the core "2-minute window" for posting unfiltered content from both cameras but adds AI companions that help users express themselves, analyze emotional contexts, and create meaningful interactions with friends. 

Targeting Gen Z and Alpha users (16-25 as the primary demographic), lol taps into the proven desire for authentic social media while solving the "mundane content problem" that has plagued BeReal. By 2025, with ATT opt-in rates reaching 35% and AI integration becoming standard (88% of marketers using AI daily), the timing is perfect for a platform that thoughtfully combines authenticity with AI enhancement.

## Core Features

* **Emotion-Enhanced Captures**: The dual-camera system analyzes facial expressions and environmental context, subtly enhancing the mood of photos through AI-generated visual elements (like weather effects that match your emotional state) while preserving the authentic moment.

* **AI Memory Journals**: The app creates private, personalized memory collections by recognizing patterns in your daily posts, helping you appreciate the evolution of your routines, relationships, and environments over time.

* **Contextual Prompts**: Unlike BeReal's generic notification, AI analyzes your typical daily patterns and sends notifications during potentially meaningful moments (significant location changes, gatherings with friends, or unusual activities).

* **Friend Insights**: An AI companion analyzes mutual interactions and suggests meaningful ways to engage with friends based on their recent posts, moods, and shared experiences, deepening connections beyond superficial likes.

* **Authentic Reactions**: Replace generic emoji reactions with AI-generated personalized responses that match your speaking style and relationship with each friend, making digital interactions feel more genuine.

## User Experience

lol maintains a minimalist, monochromatic interface with intuitive gestures that emphasize content over UI. The daily notification prompts users to capture their moment within 2 minutes, but the AI-enhanced camera subtly detects emotions and environmental context to add gentle visual enhancements that amplify the mood without filtering reality. Users can toggle between "Pure Real" (unenhanced) and "Feel Real" (AI-enhanced) modes.

The social feed shows friends' daily moments with their emotion indicators, and tapping on posts reveals AI-suggested personal responses based on your relationship history. The Memory Journal provides a private space where users can see AI-curated collections of their own moments, organized by emotional patterns, locations, or significant life changes detected over time.

## Technical Implementation

The app leverages Next.js with React Server Components for the frontend and Vercel Edge Functions for real-time AI processing. The core architecture includes:

1. **Durable Objects** for maintaining stateful chat rooms and user sessions, eliminating the connection issues that plagued BeReal
2. **OpenRouter integration** for accessing multiple AI models specialized in emotion recognition and content generation
3. **Upstash Redis** for fast, serverless data storage of user interactions and preferences
4. **Neon PostgreSQL** for structured data and relationship mapping between users
5. **Mastra workflow engine** for orchestrating complex AI analysis tasks across multiple services

The dual-camera capture system uses TensorFlow.js for on-device emotion analysis before sending data to more powerful server-side models for enhancement generation.

## Go-To-Market Strategy

Launch strategy centers on university campuses with a "Friend Circles" approach – users can only join if invited by 3+ existing members, creating trusted networks from the start. The app will leverage the "2-minute authenticity window" as a shareable moment, encouraging users to post their lol captures to other platforms with "This is how I really felt" messaging.

Growth will be driven by weekly AI-generated "Friendship Stories" that highlight meaningful connections between users and can be shared externally. Partnerships with mental health organizations will position the app as promoting digital well-being through authentic expression rather than performance.

## Resources & Inspiration

* [Reliable UX for AI Chat with Durable Objects](https://sunilpai.dev/posts/reliable-ux-for-ai-chat-with-durable-objects/) – Essential architecture for creating persistent, reliable real-time experiences without the disconnection issues that plagued BeReal.

* [Mastra Workflow Engine](https://github.com/zackees/mastra) – Provides the sophisticated state management needed for complex AI analysis of emotions and social contexts.

* [Priompt](https://github.com/anysphere/priompt) – JSX-based prompt design library perfect for creating the contextual, personalized AI interactions central to the app.

* [Emotion AI in Mobile Apps](https://www.affectiva.com/emotion-ai-overview) – Implementation frameworks for the facial expression recognition that powers the emotional enhancement features.

* [BeReal's Success Factors Analysis](https://www.businessofapps.com/data/bereal-statistics/) – Comprehensive understanding of what worked (and what didn't) in BeReal's approach to authentic social media.

* [Gen Alpha and Gen Z AI Companions](https://www.gartner.com/en/articles/what-gen-z-and-millennials-want-from-generative-ai) – Research on how younger generations interact with AI companions, showing preference for empathetic, playful interactions.

* [Upstash + Next.js Integration](https://github.com/upstash/jstack) – Optimal patterns for building low-cost serverless apps with Redis KV storage and Next.js.
  
  TECH STACK:
  {
  "frameworks": [
    "next.js",
    "react"
  ],
  "libraries": [
    "tailwindcss",
    "framer-motion",
    "shadcn-ui",
    "react-query"
  ],
  "apis": [
    "restful",
    "graphql"
  ],
  "tools": [
    "typescript",
    "eslint",
    "prisma"
  ],
  "documentationLinks": {
    "next.js": "https://nextjs.org/",
    "react": "https://reactjs.org/",
    "tailwindcss": "https://tailwindcss.com/",
    "framer-motion": "https://www.framer.com/motion/",
    "shadcn-ui": "https://ui.shadcn.com/",
    "react-query": "https://tanstack.com/query/latest",
    "graphql": "https://graphql.org/",
    "restful": "https://restfulapi.net/",
    "typescript": "https://www.typescriptlang.org/",
    "eslint": "https://eslint.org/",
    "prisma": "https://www.prisma.io/"
  }
}
  
  The setup command prompt should include:
  1. System requirements and prerequisites
  2. Repository cloning instructions
  3. Dependency installation commands
  4. Environment configuration steps
  5. Database setup (if applicable)
  6. Build/compilation instructions
  7. Verification steps to ensure setup was successful
  8. Troubleshooting tips for common setup issues
  
  Return ONLY the content of the setup command prompt in markdown format, no additional explanations.
  Use the filename "setup.md" at the top of the document.

[2025-03-06T09:22:15.058Z] [INFO] [LLM:lki613jhrs9] Using base URL: http://localhost:9000
[LLM API] Received request
[LLM API] Request params: model=anthropic/claude-3.7-sonnet, temp=0.7
[LLM API] Created simple user message
[LLM API] Calling OpenRouter with model: anthropic/claude-3.7-sonnet
[LLM API] Success! Response contains 1 choices
 POST /api/llm 200 in 38432ms
[2025-03-06T09:22:53.605Z] [INFO] [LLM:lki613jhrs9] Response status: 200
[2025-03-06T09:22:53.605Z] [INFO] [LLM:lki613jhrs9] Response length: 8188
[2025-03-06T09:22:53.605Z] [INFO] [LLM:lki613jhrs9] LLM Response
[2025-03-06T09:22:53.605Z] [INFO] [LLM:lki613jhrs9] Data: # setup.md

# lol: Authentic Moments, Enhanced by AI - Setup Guide

This document will guide you through setting up the lol project from scratch.

## 1. System Requirements and Prerequisites

- **Node.js**: v18.17.0 or later
- **npm**: v9.6.0 or later
- **Git**: v2.30.0 or later
- **PostgreSQL**: v14.0 or later
- **Docker**: (optional) v24.0.0 or later for containerized development

Verify your installations:

```bash
node --version
npm --version
git --version
postgres --version
docker --version
```

## 2. Repository Setup

```bash
# Create a new project directory
mkdir lol
cd lol

# Initialize a new Git repository
git init

# Create a .gitignore file with common exclusions
cat > .gitignore << 'EOL'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOL
```

## 3. Project Initialization

```bash
# Initialize a new Next.js project with TypeScript
npx create-next-app@latest . --typescript --eslint --tailwind --app --src-dir --import-alias "@/*"

# Answer the prompts as follows:
# ✔ Would you like to use ESLint? … Yes
# ✔ Would you like to use Tailwind CSS? … Yes
# ✔ Would you like to use `src/` directory? … Yes
# ✔ Would you like to use App Router? (recommended) … Yes
# ✔ Would you like to customize the default import alias (@/*)? … No
```

## 4. Install Dependencies

```bash
# Install core dependencies
npm install framer-motion @tanstack/react-query @prisma/client zod zustand axios

# Install shadcn UI
npx shadcn-ui@latest init

# Answer the prompts as follows:
# ✓ Would you like to use TypeScript (recommended)? … yes
# ✓ Which style would you like to use? › Default
# ✓ Which color would you like to use as base color? › Slate
# ✓ Where is your global CSS file? … src/app/globals.css
# ✓ Would you like to use CSS variables for colors? … yes
# ✓ Where is your tailwind.config.js located? … tailwind.config.js
# ✓ Configure the import alias for components: … @/components
# ✓ Configure the import alias for utils: … @/lib/utils
# ✓ Are you using React Server Components? … yes
# ✓ Write configuration to components.json? … yes

# Install common shadcn UI components
npx shadcn-ui@latest add button card dialog form input toast avatar dropdown-menu

# Install development dependencies
npm install -D prisma @graphql-codegen/cli @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-query
```

## 5. Environment Configuration

```bash
# Create .env file with necessary environment variables
cat > .env << 'EOL'
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lol_db?schema=public"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# AI Services
OPENAI_API_KEY="your-openai-api-key"

# Storage
UPSTASH_REDIS_REST_URL="your-upstash-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-token"

# Deployment
NEXT_PUBLIC_APP_URL="http://localhost:3000"
EOL

# Create a template for others
cp .env .env.example
```

## 6. Database Setup

```bash
# Initialize Prisma
npx prisma init

# Create the database schema
cat > prisma/schema.prisma << 'EOL'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  posts         Post[]
  friends       Friend[]
  friendsOf     Friend[]  @relation("FriendOf")
}

model Friend {
  id        String   @id @default(cuid())
  userId    String
  friendId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  friend    User     @relation("FriendOf", fields: [friendId], references: [id], onDelete: Cascade)

  @@unique([userId, friendId])
}

model Post {
  id          String   @id @default(cuid())
  mainImage   String
  secondaryImage String
  caption     String?
  mood        String?
  aiEnhanced  Boolean  @default(false)
  createdAt   DateTime @default(now())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  reactions   Reaction[]
}

model Reaction {
  id        String   @id @default(cuid())
  content   String
  postId    String
  userId    String
  createdAt DateTime @default(now())
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([postId, userId])
}
EOL

# Create the database and apply the schema
npx prisma db push

# Generate Prisma client
npx prisma generate
```

## 7. Project Structure Setup

```bash
# Create necessary directories
mkdir -p src/components/ui
mkdir -p src/components/forms
mkdir -p src/components/layout
mkdir -p src/lib/api
mkdir -p src/lib/hooks
mkdir -p src/lib/utils
mkdir -p src/lib/auth
mkdir -p src/lib/ai
mkdir -p src/app/api
mkdir -p prisma/migrations

# Create a basic API client
cat > src/lib/api/client.ts << 'EOL'
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
EOL

# Create a basic layout component
cat > src/components/layout/MainLayout.tsx << 'EOL'
import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </main>
  );
}
EOL

# Update page.tsx with a welcome page
cat > src/app/page.tsx << 'EOL'
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Welcome to lol
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Authentic Moments, Enhanced by AI
        </p>
        <Button size="lg">Get Started</Button>
      </div>
    </MainLayout>
  );
}
EOL
```

## 8. Run and Verify Setup

```bash
# Start the development server
npm run dev

# In a new terminal, verify that Prisma can connect to your database
npx prisma studio
```

Your application should now be running at [http://localhost:3000](http://localhost:3000) and Prisma Studio at [http://localhost:5555](http://localhost:5555).

## 9. Troubleshooting Common Issues

### Database Connection Issues

If you encounter database connection errors:

```bash
# Check if PostgreSQL is running
sudo service postgresql status  # Linux
brew services list              # macOS

# Start PostgreSQL if it's not running
sudo service postgresql start   # Linux
brew services start postgresql  # macOS

# Verify your connection string in .env
# Try connecting manually
psql "postgresql://postgres:postgres@localhost:5432/lol_db"

# Create the database if it doesn't exist
createdb lol_db
```

### Next.js Build Issues

If you encounter build errors:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall node modules
rm -rf node_modules
npm install
```

### TypeScript Errors

If you encounter TypeScript errors:

```bash
# Regenerate TypeScript definitions
npx prisma generate

# Check TypeScript configuration
cat tsconfig.json

# Run TypeScript check
npx tsc --noEmit
```

## 10. Next Steps

1. Set up authentication with NextAuth.js
2. Implement the camera capture feature
3. Develop the AI emotion analysis components
4. Create the social feed interface
5. Implement the friend system
6. Develop the memory journal feature

Congratulations! You've successfully set up the lol project. Happy coding!
[2025-03-06T09:22:53.606Z] [INFO] [LLM:et4bp4xyz4w] Request to anthropic/claude-3.7-sonnet
[2025-03-06T09:22:53.606Z] [INFO] [LLM:et4bp4xyz4w] LLM Request
[2025-03-06T09:22:53.606Z] [INFO] [LLM:et4bp4xyz4w] Data: 
  You are an expert software engineering workflow architect.
  Create a detailed deployment command prompt to guide developers through deploying the project to production.
  
  PROJECT NAME: lol
  
  PROJECT DESCRIPTION: 
  # **lol: Authentic Moments, Enhanced by AI**

> *A social app that uses AI to create genuine, expressive interactions between friends without the pressure of perfect posts.*

## Concept Overview
lol reimagines the authenticity movement pioneered by BeReal, addressing the platform's declining engagement by introducing AI-powered features that enhance genuine social connections rather than replacing them. The app maintains the core "2-minute window" for posting unfiltered content from both cameras but adds AI companions that help users express themselves, analyze emotional contexts, and create meaningful interactions with friends. 

Targeting Gen Z and Alpha users (16-25 as the primary demographic), lol taps into the proven desire for authentic social media while solving the "mundane content problem" that has plagued BeReal. By 2025, with ATT opt-in rates reaching 35% and AI integration becoming standard (88% of marketers using AI daily), the timing is perfect for a platform that thoughtfully combines authenticity with AI enhancement.

## Core Features

* **Emotion-Enhanced Captures**: The dual-camera system analyzes facial expressions and environmental context, subtly enhancing the mood of photos through AI-generated visual elements (like weather effects that match your emotional state) while preserving the authentic moment.

* **AI Memory Journals**: The app creates private, personalized memory collections by recognizing patterns in your daily posts, helping you appreciate the evolution of your routines, relationships, and environments over time.

* **Contextual Prompts**: Unlike BeReal's generic notification, AI analyzes your typical daily patterns and sends notifications during potentially meaningful moments (significant location changes, gatherings with friends, or unusual activities).

* **Friend Insights**: An AI companion analyzes mutual interactions and suggests meaningful ways to engage with friends based on their recent posts, moods, and shared experiences, deepening connections beyond superficial likes.

* **Authentic Reactions**: Replace generic emoji reactions with AI-generated personalized responses that match your speaking style and relationship with each friend, making digital interactions feel more genuine.

## User Experience

lol maintains a minimalist, monochromatic interface with intuitive gestures that emphasize content over UI. The daily notification prompts users to capture their moment within 2 minutes, but the AI-enhanced camera subtly detects emotions and environmental context to add gentle visual enhancements that amplify the mood without filtering reality. Users can toggle between "Pure Real" (unenhanced) and "Feel Real" (AI-enhanced) modes.

The social feed shows friends' daily moments with their emotion indicators, and tapping on posts reveals AI-suggested personal responses based on your relationship history. The Memory Journal provides a private space where users can see AI-curated collections of their own moments, organized by emotional patterns, locations, or significant life changes detected over time.

## Technical Implementation

The app leverages Next.js with React Server Components for the frontend and Vercel Edge Functions for real-time AI processing. The core architecture includes:

1. **Durable Objects** for maintaining stateful chat rooms and user sessions, eliminating the connection issues that plagued BeReal
2. **OpenRouter integration** for accessing multiple AI models specialized in emotion recognition and content generation
3. **Upstash Redis** for fast, serverless data storage of user interactions and preferences
4. **Neon PostgreSQL** for structured data and relationship mapping between users
5. **Mastra workflow engine** for orchestrating complex AI analysis tasks across multiple services

The dual-camera capture system uses TensorFlow.js for on-device emotion analysis before sending data to more powerful server-side models for enhancement generation.

## Go-To-Market Strategy

Launch strategy centers on university campuses with a "Friend Circles" approach – users can only join if invited by 3+ existing members, creating trusted networks from the start. The app will leverage the "2-minute authenticity window" as a shareable moment, encouraging users to post their lol captures to other platforms with "This is how I really felt" messaging.

Growth will be driven by weekly AI-generated "Friendship Stories" that highlight meaningful connections between users and can be shared externally. Partnerships with mental health organizations will position the app as promoting digital well-being through authentic expression rather than performance.

## Resources & Inspiration

* [Reliable UX for AI Chat with Durable Objects](https://sunilpai.dev/posts/reliable-ux-for-ai-chat-with-durable-objects/) – Essential architecture for creating persistent, reliable real-time experiences without the disconnection issues that plagued BeReal.

* [Mastra Workflow Engine](https://github.com/zackees/mastra) – Provides the sophisticated state management needed for complex AI analysis of emotions and social contexts.

* [Priompt](https://github.com/anysphere/priompt) – JSX-based prompt design library perfect for creating the contextual, personalized AI interactions central to the app.

* [Emotion AI in Mobile Apps](https://www.affectiva.com/emotion-ai-overview) – Implementation frameworks for the facial expression recognition that powers the emotional enhancement features.

* [BeReal's Success Factors Analysis](https://www.businessofapps.com/data/bereal-statistics/) – Comprehensive understanding of what worked (and what didn't) in BeReal's approach to authentic social media.

* [Gen Alpha and Gen Z AI Companions](https://www.gartner.com/en/articles/what-gen-z-and-millennials-want-from-generative-ai) – Research on how younger generations interact with AI companions, showing preference for empathetic, playful interactions.

* [Upstash + Next.js Integration](https://github.com/upstash/jstack) – Optimal patterns for building low-cost serverless apps with Redis KV storage and Next.js.
  
  TECH STACK:
  {
  "frameworks": [
    "next.js",
    "react"
  ],
  "libraries": [
    "tailwindcss",
    "framer-motion",
    "shadcn-ui",
    "react-query"
  ],
  "apis": [
    "restful",
    "graphql"
  ],
  "tools": [
    "typescript",
    "eslint",
    "prisma"
  ],
  "documentationLinks": {
    "next.js": "https://nextjs.org/",
    "react": "https://reactjs.org/",
    "tailwindcss": "https://tailwindcss.com/",
    "framer-motion": "https://www.framer.com/motion/",
    "shadcn-ui": "https://ui.shadcn.com/",
    "react-query": "https://tanstack.com/query/latest",
    "graphql": "https://graphql.org/",
    "restful": "https://restfulapi.net/",
    "typescript": "https://www.typescriptlang.org/",
    "eslint": "https://eslint.org/",
    "prisma": "https://www.prisma.io/"
  }
}
  
  The deployment command prompt should include:
  1. Pre-deployment checklist
  2. Build/compilation steps for production
  3. Infrastructure provisioning commands (if applicable)
  4. Deployment commands for various environments (staging, production)
  5. Post-deployment verification steps
  6. Rollback procedures in case of deployment issues
  7. Monitoring and logging setup
  8. Troubleshooting tips for common deployment issues
  
  Return ONLY the content of the deployment command prompt in markdown format, no additional explanations.
  Use the filename "deployment.md" at the top of the document.

[2025-03-06T09:22:53.606Z] [INFO] [LLM:et4bp4xyz4w] Using base URL: http://localhost:9000
[LLM API] Received request
[LLM API] Request params: model=anthropic/claude-3.7-sonnet, temp=0.7
[LLM API] Created simple user message
[LLM API] Calling OpenRouter with model: anthropic/claude-3.7-sonnet
[LLM API] Success! Response contains 1 choices
 POST /api/llm 200 in 22222ms
[2025-03-06T09:23:15.835Z] [INFO] [LLM:et4bp4xyz4w] Response status: 200
[2025-03-06T09:23:15.835Z] [INFO] [LLM:et4bp4xyz4w] Response length: 4462
[2025-03-06T09:23:15.835Z] [INFO] [LLM:et4bp4xyz4w] LLM Response
[2025-03-06T09:23:15.835Z] [INFO] [LLM:et4bp4xyz4w] Data: # deployment.md

# lol - Deployment Guide

## Pre-Deployment Checklist

```bash
# 1. Ensure you're on the main branch with latest changes
git checkout main
git pull origin main

# 2. Verify environment variables are configured
cp .env.example .env.production
nano .env.production
# Fill in all required production environment variables

# 3. Run tests to ensure everything works
npm run test

# 4. Check for security vulnerabilities
npm audit
npx prisma validate

# 5. Verify TypeScript compilation
npm run type-check

# 6. Run ESLint to check for code quality issues
npm run lint

# 7. Ensure database migrations are ready
npx prisma migrate status
```

## Build/Compilation Steps for Production

```bash
# 1. Install dependencies (using clean install for consistency)
npm ci

# 2. Build the Next.js application for production
npm run build

# 3. Verify the build output
ls -la .next/
```

## Infrastructure Provisioning

```bash
# 1. Provision Vercel project (if not already done)
npx vercel login
npx vercel link

# 2. Provision PostgreSQL database with Neon
npx neon-cli create-database lol-production

# 3. Provision Redis instance with Upstash
npx upstash-cli create redis lol-production

# 4. Set up Cloudflare Durable Objects
npx wrangler login
npx wrangler publish durable-objects.js

# 5. Configure OpenRouter API
curl -X POST https://openrouter.ai/api/v1/auth/keys \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{"name": "lol-production"}'
```

## Deployment Commands

### Staging Deployment

```bash
# 1. Push to staging environment
npx vercel --env-file .env.staging

# 2. Run database migrations on staging
npx prisma migrate deploy --preview-feature

# 3. Seed staging database (if needed)
npx prisma db seed --preview-feature
```

### Production Deployment

```bash
# 1. Deploy to production
npx vercel --prod --env-file .env.production

# 2. Run database migrations on production
NODE_ENV=production npx prisma migrate deploy

# 3. Verify Cloudflare Workers are deployed
npx wrangler tail --status active
```

## Post-Deployment Verification

```bash
# 1. Verify the deployed application
curl -I https://lol.app

# 2. Run smoke tests against production
npm run test:e2e -- --config baseUrl=https://lol.app

# 3. Verify API endpoints
curl https://lol.app/api/health

# 4. Check database connections
npx prisma studio --env-file .env.production

# 5. Verify Redis connections
npx upstash-cli ping lol-production

# 6. Monitor initial user activity
npx vercel logs --follow
```

## Rollback Procedures

```bash
# 1. Rollback to previous deployment
npx vercel rollback

# 2. Rollback database migration (if needed)
npx prisma migrate resolve --rolled-back "migration_name"

# 3. Restore Redis data (if needed)
npx upstash-cli restore lol-production --from-snapshot "snapshot_id"

# 4. Notify team about rollback
curl -X POST $SLACK_WEBHOOK_URL -d '{"text":"⚠️ Production rollback initiated for lol app"}'
```

## Monitoring and Logging Setup

```bash
# 1. Set up Vercel Analytics
npx vercel analytics enable

# 2. Configure Sentry for error tracking
npx @sentry/wizard -i nextjs

# 3. Set up Uptime monitoring
curl -X POST https://betteruptime.com/api/v1/monitors \
  -H "Authorization: Bearer $BETTERUPTIME_API_KEY" \
  -d '{"url": "https://lol.app", "monitor_type": "status"}'

# 4. Configure log drains
npx vercel logdrains add https://api.logflare.app/logs/vercel \
  --header "X-API-KEY: $LOGFLARE_API_KEY"
```

## Troubleshooting Tips

### Database Connection Issues

```bash
# Check database connection
npx prisma db execute --stdin < scripts/check-connection.sql

# View recent database logs
npx neon-cli logs lol-production
```

### API Errors

```bash
# Check API response codes
curl -I https://lol.app/api/health

# Test GraphQL endpoint
curl -X POST https://lol.app/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ health }"}'
```

### Performance Issues

```bash
# Run Lighthouse audit
npx lighthouse https://lol.app --output=json --output-path=./lighthouse-report.json

# Check for memory leaks
npx vercel inspect --memory
```

### Authentication Problems

```bash
# Verify auth endpoints
curl -I https://lol.app/api/auth/session

# Check JWT configuration
node scripts/verify-jwt-config.js
```

### Cloudflare Durable Objects Issues

```bash
# Check Durable Objects status
npx wrangler tail --status active

# Restart problematic Durable Objects
npx wrangler durable-objects delete-all ChatRoom
```
[2025-03-06T09:23:15.835Z] [INFO] [LLM:e47frxkqifq] Request to anthropic/claude-3.7-sonnet
[2025-03-06T09:23:15.835Z] [INFO] [LLM:e47frxkqifq] LLM Request
[2025-03-06T09:23:15.835Z] [INFO] [LLM:e47frxkqifq] Data: 
  You are an expert software engineering workflow architect.
  Create a detailed testing command prompt to guide developers through testing the project.
  
  PROJECT NAME: lol
  
  PROJECT DESCRIPTION: 
  # **lol: Authentic Moments, Enhanced by AI**

> *A social app that uses AI to create genuine, expressive interactions between friends without the pressure of perfect posts.*

## Concept Overview
lol reimagines the authenticity movement pioneered by BeReal, addressing the platform's declining engagement by introducing AI-powered features that enhance genuine social connections rather than replacing them. The app maintains the core "2-minute window" for posting unfiltered content from both cameras but adds AI companions that help users express themselves, analyze emotional contexts, and create meaningful interactions with friends. 

Targeting Gen Z and Alpha users (16-25 as the primary demographic), lol taps into the proven desire for authentic social media while solving the "mundane content problem" that has plagued BeReal. By 2025, with ATT opt-in rates reaching 35% and AI integration becoming standard (88% of marketers using AI daily), the timing is perfect for a platform that thoughtfully combines authenticity with AI enhancement.

## Core Features

* **Emotion-Enhanced Captures**: The dual-camera system analyzes facial expressions and environmental context, subtly enhancing the mood of photos through AI-generated visual elements (like weather effects that match your emotional state) while preserving the authentic moment.

* **AI Memory Journals**: The app creates private, personalized memory collections by recognizing patterns in your daily posts, helping you appreciate the evolution of your routines, relationships, and environments over time.

* **Contextual Prompts**: Unlike BeReal's generic notification, AI analyzes your typical daily patterns and sends notifications during potentially meaningful moments (significant location changes, gatherings with friends, or unusual activities).

* **Friend Insights**: An AI companion analyzes mutual interactions and suggests meaningful ways to engage with friends based on their recent posts, moods, and shared experiences, deepening connections beyond superficial likes.

* **Authentic Reactions**: Replace generic emoji reactions with AI-generated personalized responses that match your speaking style and relationship with each friend, making digital interactions feel more genuine.

## User Experience

lol maintains a minimalist, monochromatic interface with intuitive gestures that emphasize content over UI. The daily notification prompts users to capture their moment within 2 minutes, but the AI-enhanced camera subtly detects emotions and environmental context to add gentle visual enhancements that amplify the mood without filtering reality. Users can toggle between "Pure Real" (unenhanced) and "Feel Real" (AI-enhanced) modes.

The social feed shows friends' daily moments with their emotion indicators, and tapping on posts reveals AI-suggested personal responses based on your relationship history. The Memory Journal provides a private space where users can see AI-curated collections of their own moments, organized by emotional patterns, locations, or significant life changes detected over time.

## Technical Implementation

The app leverages Next.js with React Server Components for the frontend and Vercel Edge Functions for real-time AI processing. The core architecture includes:

1. **Durable Objects** for maintaining stateful chat rooms and user sessions, eliminating the connection issues that plagued BeReal
2. **OpenRouter integration** for accessing multiple AI models specialized in emotion recognition and content generation
3. **Upstash Redis** for fast, serverless data storage of user interactions and preferences
4. **Neon PostgreSQL** for structured data and relationship mapping between users
5. **Mastra workflow engine** for orchestrating complex AI analysis tasks across multiple services

The dual-camera capture system uses TensorFlow.js for on-device emotion analysis before sending data to more powerful server-side models for enhancement generation.

## Go-To-Market Strategy

Launch strategy centers on university campuses with a "Friend Circles" approach – users can only join if invited by 3+ existing members, creating trusted networks from the start. The app will leverage the "2-minute authenticity window" as a shareable moment, encouraging users to post their lol captures to other platforms with "This is how I really felt" messaging.

Growth will be driven by weekly AI-generated "Friendship Stories" that highlight meaningful connections between users and can be shared externally. Partnerships with mental health organizations will position the app as promoting digital well-being through authentic expression rather than performance.

## Resources & Inspiration

* [Reliable UX for AI Chat with Durable Objects](https://sunilpai.dev/posts/reliable-ux-for-ai-chat-with-durable-objects/) – Essential architecture for creating persistent, reliable real-time experiences without the disconnection issues that plagued BeReal.

* [Mastra Workflow Engine](https://github.com/zackees/mastra) – Provides the sophisticated state management needed for complex AI analysis of emotions and social contexts.

* [Priompt](https://github.com/anysphere/priompt) – JSX-based prompt design library perfect for creating the contextual, personalized AI interactions central to the app.

* [Emotion AI in Mobile Apps](https://www.affectiva.com/emotion-ai-overview) – Implementation frameworks for the facial expression recognition that powers the emotional enhancement features.

* [BeReal's Success Factors Analysis](https://www.businessofapps.com/data/bereal-statistics/) – Comprehensive understanding of what worked (and what didn't) in BeReal's approach to authentic social media.

* [Gen Alpha and Gen Z AI Companions](https://www.gartner.com/en/articles/what-gen-z-and-millennials-want-from-generative-ai) – Research on how younger generations interact with AI companions, showing preference for empathetic, playful interactions.

* [Upstash + Next.js Integration](https://github.com/upstash/jstack) – Optimal patterns for building low-cost serverless apps with Redis KV storage and Next.js.
  
  TECH STACK:
  {
  "frameworks": [
    "next.js",
    "react"
  ],
  "libraries": [
    "tailwindcss",
    "framer-motion",
    "shadcn-ui",
    "react-query"
  ],
  "apis": [
    "restful",
    "graphql"
  ],
  "tools": [
    "typescript",
    "eslint",
    "prisma"
  ],
  "documentationLinks": {
    "next.js": "https://nextjs.org/",
    "react": "https://reactjs.org/",
    "tailwindcss": "https://tailwindcss.com/",
    "framer-motion": "https://www.framer.com/motion/",
    "shadcn-ui": "https://ui.shadcn.com/",
    "react-query": "https://tanstack.com/query/latest",
    "graphql": "https://graphql.org/",
    "restful": "https://restfulapi.net/",
    "typescript": "https://www.typescriptlang.org/",
    "eslint": "https://eslint.org/",
    "prisma": "https://www.prisma.io/"
  }
}
  
  The testing command prompt should include:
  1. Overview of the testing strategy
  2. Setting up the testing environment
  3. Running unit tests
  4. Running integration tests
  5. Running end-to-end tests
  6. Testing specific features
  7. Test coverage reporting
  8. Continuous integration testing
  9. Troubleshooting common testing issues
  
  Return ONLY the content of the testing command prompt in markdown format, no additional explanations.
  Use the filename "testing.md" at the top of the document.

[2025-03-06T09:23:15.836Z] [INFO] [LLM:e47frxkqifq] Using base URL: http://localhost:9000
[LLM API] Received request
[LLM API] Request params: model=anthropic/claude-3.7-sonnet, temp=0.7
[LLM API] Created simple user message
[LLM API] Calling OpenRouter with model: anthropic/claude-3.7-sonnet
[LLM API] Success! Response contains 1 choices
 POST /api/llm 200 in 33755ms
[2025-03-06T09:23:49.602Z] [INFO] [LLM:e47frxkqifq] Response status: 200
[2025-03-06T09:23:49.602Z] [INFO] [LLM:e47frxkqifq] Response length: 8731
[2025-03-06T09:23:49.602Z] [INFO] [LLM:e47frxkqifq] LLM Response
[2025-03-06T09:23:49.602Z] [INFO] [LLM:e47frxkqifq] Data: # testing.md

# lol App Testing Guide

## 1. Testing Strategy Overview

The lol app requires comprehensive testing across multiple layers to ensure both functionality and user experience. Our testing strategy follows a pyramid approach:

- **Unit Tests**: Testing individual components, functions, and utilities
- **Integration Tests**: Testing interactions between components and services
- **End-to-End Tests**: Testing complete user flows and scenarios
- **Emotion AI Tests**: Specialized testing for AI-powered features
- **Performance Tests**: Ensuring app responsiveness and reliability

## 2. Setting Up the Testing Environment

### Prerequisites

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.test
```

Edit `.env.test` to include test-specific configurations:

```
# Test database connection
DATABASE_URL=postgresql://test_user:test_password@localhost:5432/lol_test

# Test AI services
AI_SERVICE_KEY=test_key
EMOTION_API_ENDPOINT=https://test-endpoint.com/emotion

# Mock camera access
MOCK_CAMERA=true
```

### Initialize Test Database

```bash
# Create test database schema
npx prisma migrate deploy --preview-feature

# Seed test data
npm run seed:test
```

## 3. Running Unit Tests

Unit tests focus on individual components and functions.

```bash
# Run all unit tests
npm run test:unit

# Run tests for specific component or feature
npm run test:unit -- --testPathPattern=src/components/EmotionCapture

# Run tests in watch mode during development
npm run test:unit -- --watch

# Run tests with coverage report
npm run test:unit -- --coverage
```

### Testing React Components

```bash
# Test UI components
npm run test:unit -- --testPathPattern=src/components

# Test hooks
npm run test:unit -- --testPathPattern=src/hooks
```

### Testing Utilities and Helpers

```bash
# Test utility functions
npm run test:unit -- --testPathPattern=src/utils

# Test API client functions
npm run test:unit -- --testPathPattern=src/api
```

## 4. Running Integration Tests

Integration tests verify interactions between components and services.

```bash
# Run all integration tests
npm run test:integration

# Test specific integration flows
npm run test:integration -- --testPathPattern=src/integrations/EmotionEnhancement

# Test API integrations
npm run test:integration -- --testPathPattern=src/integrations/api
```

### Testing Database Interactions

```bash
# Test Prisma model interactions
npm run test:integration -- --testPathPattern=src/integrations/database

# Test data persistence flows
npm run test:integration -- --testPathPattern=src/integrations/persistence
```

### Testing API Integrations

```bash
# Test OpenRouter integration
npm run test:integration -- --testPathPattern=src/integrations/openrouter

# Test Upstash Redis interactions
npm run test:integration -- --testPathPattern=src/integrations/upstash
```

## 5. Running End-to-End Tests

End-to-end tests simulate real user interactions across complete flows.

```bash
# Start the application in test mode
npm run dev:test

# In a separate terminal, run all E2E tests
npm run test:e2e

# Run specific user flow tests
npm run test:e2e -- --testPathPattern=tests/e2e/EmotionCapture

# Record test videos (useful for debugging)
npm run test:e2e -- --record
```

### Testing Core User Flows

```bash
# Test user registration and onboarding
npm run test:e2e -- --testPathPattern=tests/e2e/Onboarding

# Test dual-camera capture process
npm run test:e2e -- --testPathPattern=tests/e2e/DualCameraCapture

# Test friend interactions
npm run test:e2e -- --testPathPattern=tests/e2e/FriendInteractions
```

## 6. Testing Specific Features

### Emotion-Enhanced Captures

```bash
# Unit tests for emotion detection
npm run test:unit -- --testPathPattern=src/features/EmotionDetection

# Integration tests for visual enhancements
npm run test:integration -- --testPathPattern=src/integrations/VisualEnhancement

# E2E tests for complete emotion capture flow
npm run test:e2e -- --testPathPattern=tests/e2e/EmotionCapture
```

### AI Memory Journals

```bash
# Test pattern recognition
npm run test:unit -- --testPathPattern=src/features/PatternRecognition

# Test memory collection generation
npm run test:integration -- --testPathPattern=src/integrations/MemoryCollection

# Test complete memory journal experience
npm run test:e2e -- --testPathPattern=tests/e2e/MemoryJournal
```

### Contextual Prompts

```bash
# Test notification timing algorithms
npm run test:unit -- --testPathPattern=src/features/NotificationTiming

# Test context analysis
npm run test:integration -- --testPathPattern=src/integrations/ContextAnalysis

# Test notification delivery
npm run test:e2e -- --testPathPattern=tests/e2e/ContextualNotifications
```

### Friend Insights

```bash
# Test interaction analysis
npm run test:unit -- --testPathPattern=src/features/InteractionAnalysis

# Test suggestion generation
npm run test:integration -- --testPathPattern=src/integrations/SuggestionGeneration

# Test complete friend insight flow
npm run test:e2e -- --testPathPattern=tests/e2e/FriendInsights
```

### Authentic Reactions

```bash
# Test personalized response generation
npm run test:unit -- --testPathPattern=src/features/ResponseGeneration

# Test style matching
npm run test:integration -- --testPathPattern=src/integrations/StyleMatching

# Test complete reaction flow
npm run test:e2e -- --testPathPattern=tests/e2e/AuthenticReactions
```

## 7. Test Coverage Reporting

Generate and analyze test coverage to identify untested code.

```bash
# Generate coverage report for all tests
npm run test:coverage

# Generate coverage for specific test types
npm run test:unit -- --coverage
npm run test:integration -- --coverage

# Open coverage report in browser
npm run test:coverage:open

# Check if coverage meets thresholds
npm run test:coverage:check
```

Coverage thresholds are configured in `jest.config.js`:

```javascript
// Minimum coverage requirements
coverageThreshold: {
  global: {
    statements: 80,
    branches: 75,
    functions: 80,
    lines: 80,
  },
  "./src/features/": {
    statements: 90,
    branches: 85,
    functions: 90,
    lines: 90,
  },
}
```

## 8. Continuous Integration Testing

Our CI pipeline runs tests automatically on code changes.

### GitHub Actions Workflow

Tests run automatically on:
- Pull requests to main branch
- Direct pushes to main branch
- Nightly builds

```bash
# Manually trigger CI tests locally
npm run test:ci

# Run the same tests that CI runs
npm run test:ci:local
```

### Pre-commit Hooks

Set up pre-commit hooks to run tests before committing:

```bash
# Install husky for pre-commit hooks
npx husky install

# Add pre-commit hook for quick tests
npx husky add .husky/pre-commit "npm run test:quick"
```

## 9. Troubleshooting Common Testing Issues

### Camera Access in Tests

```bash
# Test with mock camera
export MOCK_CAMERA=true
npm run test:e2e

# Test with headless browser
npm run test:e2e -- --headless
```

### AI Service Connectivity

```bash
# Use mock AI services
export MOCK_AI_SERVICES=true
npm run test:integration

# Test with specific AI model
export AI_MODEL=test-model
npm run test:integration
```

### Database Connection Issues

```bash
# Reset test database
npm run db:reset:test

# Run tests with in-memory database
export USE_IN_MEMORY_DB=true
npm run test:integration
```

### Flaky Tests

```bash
# Identify flaky tests by running multiple times
npm run test:flaky

# Run a specific test multiple times
npm run test:repeat -- --testPathPattern=src/features/EmotionDetection --repeat=10
```

## 10. Custom Testing Tools

### Emotion Simulator

Test emotion detection with simulated expressions:

```bash
# Run emotion detection tests with simulated expressions
npm run test:emotions

# Test specific emotions
npm run test:emotions -- --emotion=happy
npm run test:emotions -- --emotion=sad
```

### Performance Testing

```bash
# Run performance tests
npm run test:performance

# Test specific feature performance
npm run test:performance -- --feature=EmotionCapture

# Generate performance report
npm run test:performance:report
```

### Visual Regression Testing

```bash
# Run visual regression tests
npm run test:visual

# Update baseline screenshots
npm run test:visual:update

# Test specific components
npm run test:visual -- --component=EmotionEnhancedPhoto
```

## 11. Testing Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Next.js Applications](https://nextjs.org/docs/testing)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)
[2025-03-06T09:23:49.605Z] [INFO] [LLM:3oyh5zkqfjb] Request to anthropic/claude-3.7-sonnet
[2025-03-06T09:23:49.605Z] [INFO] [LLM:3oyh5zkqfjb] LLM Request
[2025-03-06T09:23:49.605Z] [INFO] [LLM:3oyh5zkqfjb] Data: 
  You are an expert software engineering workflow architect.
  Create a detailed database setup command prompt to guide developers through setting up and managing the database for this project.
  
  PROJECT NAME: lol
  
  PROJECT DESCRIPTION: 
  # **lol: Authentic Moments, Enhanced by AI**

> *A social app that uses AI to create genuine, expressive interactions between friends without the pressure of perfect posts.*

## Concept Overview
lol reimagines the authenticity movement pioneered by BeReal, addressing the platform's declining engagement by introducing AI-powered features that enhance genuine social connections rather than replacing them. The app maintains the core "2-minute window" for posting unfiltered content from both cameras but adds AI companions that help users express themselves, analyze emotional contexts, and create meaningful interactions with friends. 

Targeting Gen Z and Alpha users (16-25 as the primary demographic), lol taps into the proven desire for authentic social media while solving the "mundane content problem" that has plagued BeReal. By 2025, with ATT opt-in rates reaching 35% and AI integration becoming standard (88% of marketers using AI daily), the timing is perfect for a platform that thoughtfully combines authenticity with AI enhancement.

## Core Features

* **Emotion-Enhanced Captures**: The dual-camera system analyzes facial expressions and environmental context, subtly enhancing the mood of photos through AI-generated visual elements (like weather effects that match your emotional state) while preserving the authentic moment.

* **AI Memory Journals**: The app creates private, personalized memory collections by recognizing patterns in your daily posts, helping you appreciate the evolution of your routines, relationships, and environments over time.

* **Contextual Prompts**: Unlike BeReal's generic notification, AI analyzes your typical daily patterns and sends notifications during potentially meaningful moments (significant location changes, gatherings with friends, or unusual activities).

* **Friend Insights**: An AI companion analyzes mutual interactions and suggests meaningful ways to engage with friends based on their recent posts, moods, and shared experiences, deepening connections beyond superficial likes.

* **Authentic Reactions**: Replace generic emoji reactions with AI-generated personalized responses that match your speaking style and relationship with each friend, making digital interactions feel more genuine.

## User Experience

lol maintains a minimalist, monochromatic interface with intuitive gestures that emphasize content over UI. The daily notification prompts users to capture their moment within 2 minutes, but the AI-enhanced camera subtly detects emotions and environmental context to add gentle visual enhancements that amplify the mood without filtering reality. Users can toggle between "Pure Real" (unenhanced) and "Feel Real" (AI-enhanced) modes.

The social feed shows friends' daily moments with their emotion indicators, and tapping on posts reveals AI-suggested personal responses based on your relationship history. The Memory Journal provides a private space where users can see AI-curated collections of their own moments, organized by emotional patterns, locations, or significant life changes detected over time.

## Technical Implementation

The app leverages Next.js with React Server Components for the frontend and Vercel Edge Functions for real-time AI processing. The core architecture includes:

1. **Durable Objects** for maintaining stateful chat rooms and user sessions, eliminating the connection issues that plagued BeReal
2. **OpenRouter integration** for accessing multiple AI models specialized in emotion recognition and content generation
3. **Upstash Redis** for fast, serverless data storage of user interactions and preferences
4. **Neon PostgreSQL** for structured data and relationship mapping between users
5. **Mastra workflow engine** for orchestrating complex AI analysis tasks across multiple services

The dual-camera capture system uses TensorFlow.js for on-device emotion analysis before sending data to more powerful server-side models for enhancement generation.

## Go-To-Market Strategy

Launch strategy centers on university campuses with a "Friend Circles" approach – users can only join if invited by 3+ existing members, creating trusted networks from the start. The app will leverage the "2-minute authenticity window" as a shareable moment, encouraging users to post their lol captures to other platforms with "This is how I really felt" messaging.

Growth will be driven by weekly AI-generated "Friendship Stories" that highlight meaningful connections between users and can be shared externally. Partnerships with mental health organizations will position the app as promoting digital well-being through authentic expression rather than performance.

## Resources & Inspiration

* [Reliable UX for AI Chat with Durable Objects](https://sunilpai.dev/posts/reliable-ux-for-ai-chat-with-durable-objects/) – Essential architecture for creating persistent, reliable real-time experiences without the disconnection issues that plagued BeReal.

* [Mastra Workflow Engine](https://github.com/zackees/mastra) – Provides the sophisticated state management needed for complex AI analysis of emotions and social contexts.

* [Priompt](https://github.com/anysphere/priompt) – JSX-based prompt design library perfect for creating the contextual, personalized AI interactions central to the app.

* [Emotion AI in Mobile Apps](https://www.affectiva.com/emotion-ai-overview) – Implementation frameworks for the facial expression recognition that powers the emotional enhancement features.

* [BeReal's Success Factors Analysis](https://www.businessofapps.com/data/bereal-statistics/) – Comprehensive understanding of what worked (and what didn't) in BeReal's approach to authentic social media.

* [Gen Alpha and Gen Z AI Companions](https://www.gartner.com/en/articles/what-gen-z-and-millennials-want-from-generative-ai) – Research on how younger generations interact with AI companions, showing preference for empathetic, playful interactions.

* [Upstash + Next.js Integration](https://github.com/upstash/jstack) – Optimal patterns for building low-cost serverless apps with Redis KV storage and Next.js.
  
  TECH STACK:
  {
  "frameworks": [
    "next.js",
    "react"
  ],
  "libraries": [
    "tailwindcss",
    "framer-motion",
    "shadcn-ui",
    "react-query"
  ],
  "apis": [
    "restful",
    "graphql"
  ],
  "tools": [
    "typescript",
    "eslint",
    "prisma"
  ],
  "documentationLinks": {
    "next.js": "https://nextjs.org/",
    "react": "https://reactjs.org/",
    "tailwindcss": "https://tailwindcss.com/",
    "framer-motion": "https://www.framer.com/motion/",
    "shadcn-ui": "https://ui.shadcn.com/",
    "react-query": "https://tanstack.com/query/latest",
    "graphql": "https://graphql.org/",
    "restful": "https://restfulapi.net/",
    "typescript": "https://www.typescriptlang.org/",
    "eslint": "https://eslint.org/",
    "prisma": "https://www.prisma.io/"
  }
}
  
  The database setup command prompt should include:
  1. Database installation and configuration
  2. Connection setup
  3. Schema creation
  4. Initial data seeding
  5. Migration commands
  6. Backup and restore procedures
  7. Database maintenance tasks
  8. Common database troubleshooting
  
  Return ONLY the content of the database setup command prompt in markdown format, no additional explanations.
  Use the filename "database-setup.md" at the top of the document.

[2025-03-06T09:23:49.606Z] [INFO] [LLM:3oyh5zkqfjb] Using base URL: http://localhost:9000
[LLM API] Received request
[LLM API] Request params: model=anthropic/claude-3.7-sonnet, temp=0.7
[LLM API] Created simple user message
[LLM API] Calling OpenRouter with model: anthropic/claude-3.7-sonnet
[LLM API] Success! Response contains 1 choices
 POST /api/llm 200 in 49079ms
[2025-03-06T09:24:38.698Z] [INFO] [LLM:3oyh5zkqfjb] Response status: 200
[2025-03-06T09:24:38.698Z] [INFO] [LLM:3oyh5zkqfjb] Response length: 12352
[2025-03-06T09:24:38.698Z] [INFO] [LLM:3oyh5zkqfjb] LLM Response
[2025-03-06T09:24:38.698Z] [INFO] [LLM:3oyh5zkqfjb] Data: # database-setup.md

# lol App Database Setup Guide

This guide will help you set up and manage the database for the lol social app. Follow these steps to properly configure your development environment.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Database Installation](#database-installation)
- [Connection Setup](#connection-setup)
- [Schema Setup](#schema-setup)
- [Data Seeding](#data-seeding)
- [Migration Management](#migration-management)
- [Backup & Restore](#backup--restore)
- [Maintenance Tasks](#maintenance-tasks)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js (v18+)
- npm or yarn
- Docker (recommended for local development)
- Git

## Database Installation

### Option 1: Local PostgreSQL with Docker (Recommended for Development)

```bash
# Pull the PostgreSQL image
docker pull postgres:latest

# Create a Docker volume for persistent data
docker volume create lol-postgres-data

# Start PostgreSQL container
docker run --name lol-postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_USER=loluser \
  -e POSTGRES_DB=loldb \
  -p 5432:5432 \
  -v lol-postgres-data:/var/lib/postgresql/data \
  -d postgres:latest

# Verify the container is running
docker ps
```

### Option 2: Neon PostgreSQL (Recommended for Staging/Production)

1. Create an account at [Neon](https://neon.tech/)
2. Create a new project
3. Create a new database named `loldb`
4. Save the connection string for the next step

## Connection Setup

### 1. Set up environment variables

Create a `.env` file in the root of your project:

```
# Local Development
DATABASE_URL="postgresql://loluser:yourpassword@localhost:5432/loldb?schema=public"

# For Neon PostgreSQL (Production/Staging)
# DATABASE_URL="postgresql://[username]:[password]@[neon-host]/[dbname]?sslmode=require"

# Redis for caching (optional but recommended)
REDIS_URL="redis://localhost:6379"

# Set environment
NODE_ENV="development"
```

### 2. Install Prisma dependencies

```bash
# Install Prisma CLI and client
npm install prisma @prisma/client
# or
yarn add prisma @prisma/client
```

### 3. Initialize Prisma

```bash
npx prisma init
```

## Schema Setup

### 1. Define the Prisma schema

Replace the content of `prisma/schema.prisma` with:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String    @id @default(cuid())
  email             String    @unique
  username          String    @unique
  name              String?
  passwordHash      String
  avatarUrl         String?
  bio               String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  posts             Post[]
  reactions         Reaction[]
  friendsAsUser1    Friend[]  @relation("UserOneFriends")
  friendsAsUser2    Friend[]  @relation("UserTwoFriends")
  friendRequests    FriendRequest[] @relation("ReceivedFriendRequests")
  sentFriendRequests FriendRequest[] @relation("SentFriendRequests")
  memoryCollections MemoryCollection[]
  emotionData       EmotionData[]
}

model Post {
  id               String     @id @default(cuid())
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt
  frontImageUrl    String
  backImageUrl     String
  caption          String?
  location         String?
  isEnhanced       Boolean    @default(false)
  enhancedImageUrl String?
  userId           String
  user             User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  reactions        Reaction[]
  emotionData      EmotionData?
  memoryCollections MemoryCollectionPost[]
}

model Reaction {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  postId    String
  userId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([postId, userId])
}

model Friend {
  id        String   @id @default(cuid())
  user1Id   String
  user2Id   String
  createdAt DateTime @default(now())
  user1     User     @relation("UserOneFriends", fields: [user1Id], references: [id], onDelete: Cascade)
  user2     User     @relation("UserTwoFriends", fields: [user2Id], references: [id], onDelete: Cascade)

  @@unique([user1Id, user2Id])
}

model FriendRequest {
  id        String   @id @default(cuid())
  senderId  String
  receiverId String
  status    String   @default("pending") // pending, accepted, rejected
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  sender    User     @relation("SentFriendRequests", fields: [senderId], references: [id], onDelete: Cascade)
  receiver  User     @relation("ReceivedFriendRequests", fields: [receiverId], references: [id], onDelete: Cascade)

  @@unique([senderId, receiverId])
}

model MemoryCollection {
  id          String   @id @default(cuid())
  title       String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  posts       MemoryCollectionPost[]
}

model MemoryCollectionPost {
  id                  String           @id @default(cuid())
  memoryCollectionId  String
  postId              String
  addedAt             DateTime         @default(now())
  memoryCollection    MemoryCollection @relation(fields: [memoryCollectionId], references: [id], onDelete: Cascade)
  post                Post             @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([memoryCollectionId, postId])
}

model EmotionData {
  id             String   @id @default(cuid())
  joy            Float?
  sadness        Float?
  anger          Float?
  surprise       Float?
  fear           Float?
  disgust        Float?
  dominantEmotion String?
  confidence     Float?
  createdAt      DateTime @default(now())
  postId         String?  @unique
  userId         String
  post           Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### 2. Generate Prisma client

```bash
npx prisma generate
```

### 3. Create the database schema

```bash
npx prisma db push
```

## Data Seeding

### 1. Create a seed file

Create a file at `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const password = await hash('Password123', 10);
  
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      username: 'alice',
      name: 'Alice Johnson',
      passwordHash: password,
      bio: 'Just living my best life!',
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      username: 'bob',
      name: 'Bob Smith',
      passwordHash: password,
      bio: 'Photography enthusiast',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
  });

  // Create friendship
  await prisma.friend.upsert({
    where: {
      user1Id_user2Id: {
        user1Id: user1.id,
        user2Id: user2.id,
      },
    },
    update: {},
    create: {
      user1Id: user1.id,
      user2Id: user2.id,
    },
  });

  // Create sample posts
  const post1 = await prisma.post.create({
    data: {
      userId: user1.id,
      frontImageUrl: 'https://picsum.photos/id/237/800/1000',
      backImageUrl: 'https://picsum.photos/id/238/800/1000',
      caption: 'Having a great day!',
      location: 'Central Park',
      isEnhanced: true,
      enhancedImageUrl: 'https://picsum.photos/id/239/800/1000',
    },
  });

  // Create emotion data for post
  await prisma.emotionData.create({
    data: {
      userId: user1.id,
      postId: post1.id,
      joy: 0.8,
      sadness: 0.1,
      anger: 0.0,
      surprise: 0.3,
      fear: 0.0,
      disgust: 0.0,
      dominantEmotion: 'joy',
      confidence: 0.85,
    },
  });

  // Create reaction
  await prisma.reaction.create({
    data: {
      userId: user2.id,
      postId: post1.id,
      content: 'Love the energy in this photo!',
    },
  });

  // Create memory collection
  const memoryCollection = await prisma.memoryCollection.create({
    data: {
      userId: user1.id,
      title: 'Happy Days',
      description: 'Collection of my happiest moments',
    },
  });

  // Add post to memory collection
  await prisma.memoryCollectionPost.create({
    data: {
      memoryCollectionId: memoryCollection.id,
      postId: post1.id,
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 2. Add seed script to package.json

```json
"scripts": {
  "seed": "ts-node prisma/seed.ts"
}
```

### 3. Run the seed script

```bash
npm run seed
# or
yarn seed
```

## Migration Management

### Creating migrations

```bash
# Create a migration from your Prisma schema changes
npx prisma migrate dev --name added_new_feature

# Apply migrations to the database
npx prisma migrate deploy
```

### Reset database (Development only)

```bash
# Reset the database and apply all migrations
npx prisma migrate reset
```

### View database status

```bash
# Check the current state of the database
npx prisma migrate status
```

## Backup & Restore

### PostgreSQL Backup (Local)

```bash
# For local Docker PostgreSQL
docker exec -t lol-postgres pg_dump -U loluser loldb > backup_$(date +%Y-%m-%d_%H-%M-%S).sql
```

### PostgreSQL Restore (Local)

```bash
# For local Docker PostgreSQL
cat backup_file.sql | docker exec -i lol-postgres psql -U loluser -d loldb
```

### Neon PostgreSQL Backup

```bash
# Install neon CLI if using Neon
npm install -g neonctl

# Authenticate with Neon
neonctl auth

# Create a backup
neonctl projects:branches:create-backup your-project-id your-branch-id
```

## Maintenance Tasks

### Database Inspection

```bash
# Open Prisma Studio (visual database browser)
npx prisma studio

# Connect to PostgreSQL CLI (Docker)
docker exec -it lol-postgres psql -U loluser -d loldb
```

### Performance Optimization

```bash
# Analyze database for slow queries
docker exec -it lol-postgres psql -U loluser -d loldb -c "EXPLAIN ANALYZE SELECT * FROM \"User\" WHERE email LIKE '%example%';"

# Add index to improve performance
npx prisma db execute --file ./scripts/add-index.sql
```

Example `add-index.sql`:
```sql
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User" ("email");
```

### Database Cleanup

```bash
# Remove old data (example: delete posts older than 1 year)
npx prisma db execute --file ./scripts/cleanup.sql
```

Example `cleanup.sql`:
```sql
DELETE FROM "Post" WHERE "createdAt" < NOW() - INTERVAL '1 year';
```

## Troubleshooting

### Common Issues

#### Connection Errors

```bash
# Verify database connection
npx prisma db pull

# Check if PostgreSQL is running
docker ps | grep postgres

# Restart PostgreSQL container
docker restart lol-postgres
```

#### Migration Issues

```bash
# If migrations fail, try resetting Prisma's migration history
npx prisma migrate resolve --rolled-back "20230601120000_failed_migration"

# For development environments, you can reset everything
npx prisma migrate reset
```

#### Schema Discrepancies

```bash
# If your schema doesn't match the database
npx prisma db pull
# Review changes and then
npx prisma db push

# Or create a migration to align them
npx prisma migrate dev --name align_schema
```

#### Prisma Client Generation Issues

```bash
# Regenerate Prisma client
npx prisma generate

# Clear node_modules and reinstall if necessary
rm -rf node_modules
npm install
```

---

For additional help, consult the [Prisma documentation](https://www.prisma.io/docs/) or reach out to the lol development team.
[2025-03-06T09:24:38.698Z] [INFO] [LLM:lbgmeijqj2l] Request to anthropic/claude-3.7-sonnet
[2025-03-06T09:24:38.699Z] [INFO] [LLM:lbgmeijqj2l] LLM Request
[2025-03-06T09:24:38.699Z] [INFO] [LLM:lbgmeijqj2l] Data: 
  You are an expert software engineering workflow architect.
  Create a detailed database migration command prompt to guide developers through managing database migrations for this project.
  
  PROJECT NAME: lol
  
  PROJECT DESCRIPTION: 
  # **lol: Authentic Moments, Enhanced by AI**

> *A social app that uses AI to create genuine, expressive interactions between friends without the pressure of perfect posts.*

## Concept Overview
lol reimagines the authenticity movement pioneered by BeReal, addressing the platform's declining engagement by introducing AI-powered features that enhance genuine social connections rather than replacing them. The app maintains the core "2-minute window" for posting unfiltered content from both cameras but adds AI companions that help users express themselves, analyze emotional contexts, and create meaningful interactions with friends. 

Targeting Gen Z and Alpha users (16-25 as the primary demographic), lol taps into the proven desire for authentic social media while solving the "mundane content problem" that has plagued BeReal. By 2025, with ATT opt-in rates reaching 35% and AI integration becoming standard (88% of marketers using AI daily), the timing is perfect for a platform that thoughtfully combines authenticity with AI enhancement.

## Core Features

* **Emotion-Enhanced Captures**: The dual-camera system analyzes facial expressions and environmental context, subtly enhancing the mood of photos through AI-generated visual elements (like weather effects that match your emotional state) while preserving the authentic moment.

* **AI Memory Journals**: The app creates private, personalized memory collections by recognizing patterns in your daily posts, helping you appreciate the evolution of your routines, relationships, and environments over time.

* **Contextual Prompts**: Unlike BeReal's generic notification, AI analyzes your typical daily patterns and sends notifications during potentially meaningful moments (significant location changes, gatherings with friends, or unusual activities).

* **Friend Insights**: An AI companion analyzes mutual interactions and suggests meaningful ways to engage with friends based on their recent posts, moods, and shared experiences, deepening connections beyond superficial likes.

* **Authentic Reactions**: Replace generic emoji reactions with AI-generated personalized responses that match your speaking style and relationship with each friend, making digital interactions feel more genuine.

## User Experience

lol maintains a minimalist, monochromatic interface with intuitive gestures that emphasize content over UI. The daily notification prompts users to capture their moment within 2 minutes, but the AI-enhanced camera subtly detects emotions and environmental context to add gentle visual enhancements that amplify the mood without filtering reality. Users can toggle between "Pure Real" (unenhanced) and "Feel Real" (AI-enhanced) modes.

The social feed shows friends' daily moments with their emotion indicators, and tapping on posts reveals AI-suggested personal responses based on your relationship history. The Memory Journal provides a private space where users can see AI-curated collections of their own moments, organized by emotional patterns, locations, or significant life changes detected over time.

## Technical Implementation

The app leverages Next.js with React Server Components for the frontend and Vercel Edge Functions for real-time AI processing. The core architecture includes:

1. **Durable Objects** for maintaining stateful chat rooms and user sessions, eliminating the connection issues that plagued BeReal
2. **OpenRouter integration** for accessing multiple AI models specialized in emotion recognition and content generation
3. **Upstash Redis** for fast, serverless data storage of user interactions and preferences
4. **Neon PostgreSQL** for structured data and relationship mapping between users
5. **Mastra workflow engine** for orchestrating complex AI analysis tasks across multiple services

The dual-camera capture system uses TensorFlow.js for on-device emotion analysis before sending data to more powerful server-side models for enhancement generation.

## Go-To-Market Strategy

Launch strategy centers on university campuses with a "Friend Circles" approach – users can only join if invited by 3+ existing members, creating trusted networks from the start. The app will leverage the "2-minute authenticity window" as a shareable moment, encouraging users to post their lol captures to other platforms with "This is how I really felt" messaging.

Growth will be driven by weekly AI-generated "Friendship Stories" that highlight meaningful connections between users and can be shared externally. Partnerships with mental health organizations will position the app as promoting digital well-being through authentic expression rather than performance.

## Resources & Inspiration

* [Reliable UX for AI Chat with Durable Objects](https://sunilpai.dev/posts/reliable-ux-for-ai-chat-with-durable-objects/) – Essential architecture for creating persistent, reliable real-time experiences without the disconnection issues that plagued BeReal.

* [Mastra Workflow Engine](https://github.com/zackees/mastra) – Provides the sophisticated state management needed for complex AI analysis of emotions and social contexts.

* [Priompt](https://github.com/anysphere/priompt) – JSX-based prompt design library perfect for creating the contextual, personalized AI interactions central to the app.

* [Emotion AI in Mobile Apps](https://www.affectiva.com/emotion-ai-overview) – Implementation frameworks for the facial expression recognition that powers the emotional enhancement features.

* [BeReal's Success Factors Analysis](https://www.businessofapps.com/data/bereal-statistics/) – Comprehensive understanding of what worked (and what didn't) in BeReal's approach to authentic social media.

* [Gen Alpha and Gen Z AI Companions](https://www.gartner.com/en/articles/what-gen-z-and-millennials-want-from-generative-ai) – Research on how younger generations interact with AI companions, showing preference for empathetic, playful interactions.

* [Upstash + Next.js Integration](https://github.com/upstash/jstack) – Optimal patterns for building low-cost serverless apps with Redis KV storage and Next.js.
  
  TECH STACK:
  {
  "frameworks": [
    "next.js",
    "react"
  ],
  "libraries": [
    "tailwindcss",
    "framer-motion",
    "shadcn-ui",
    "react-query"
  ],
  "apis": [
    "restful",
    "graphql"
  ],
  "tools": [
    "typescript",
    "eslint",
    "prisma"
  ],
  "documentationLinks": {
    "next.js": "https://nextjs.org/",
    "react": "https://reactjs.org/",
    "tailwindcss": "https://tailwindcss.com/",
    "framer-motion": "https://www.framer.com/motion/",
    "shadcn-ui": "https://ui.shadcn.com/",
    "react-query": "https://tanstack.com/query/latest",
    "graphql": "https://graphql.org/",
    "restful": "https://restfulapi.net/",
    "typescript": "https://www.typescriptlang.org/",
    "eslint": "https://eslint.org/",
    "prisma": "https://www.prisma.io/"
  }
}
  
  The database migration command prompt should include:
  1. Creating a new migration
  2. Running migrations
  3. Rolling back migrations
  4. Handling migration conflicts
  5. Database versioning approach
  6. Migration best practices
  7. Testing migrations
  8. Deployment considerations for migrations
  
  Return ONLY the content of the database migration command prompt in markdown format, no additional explanations.
  Use the filename "database-migrations.md" at the top of the document.

[2025-03-06T09:24:38.699Z] [INFO] [LLM:lbgmeijqj2l] Using base URL: http://localhost:9000
[LLM API] Received request
[LLM API] Request params: model=anthropic/claude-3.7-sonnet, temp=0.7
[LLM API] Created simple user message
[LLM API] Calling OpenRouter with model: anthropic/claude-3.7-sonnet
[LLM API] Success! Response contains 1 choices
 POST /api/llm 200 in 22098ms
[2025-03-06T09:25:00.805Z] [INFO] [LLM:lbgmeijqj2l] Response status: 200
[2025-03-06T09:25:00.805Z] [INFO] [LLM:lbgmeijqj2l] Response length: 5206
[2025-03-06T09:25:00.805Z] [INFO] [LLM:lbgmeijqj2l] LLM Response
[2025-03-06T09:25:00.805Z] [INFO] [LLM:lbgmeijqj2l] Data: # database-migrations.md

# lol - Database Migration Guide

This guide outlines the workflow for managing database migrations with Prisma in the lol social app project.

## Prerequisites

- Node.js v18+
- Access to development/staging database
- Prisma CLI installed (`npx prisma`)
- Proper environment variables configured in `.env`

## 1. Creating a New Migration

```bash
# Generate a new migration based on Prisma schema changes
npx prisma migrate dev --name <descriptive-migration-name>
```

**Best Practices:**
- Use descriptive names (e.g., `add-emotion-metrics-to-posts`)
- One conceptual change per migration
- Include related schema changes in a single migration
- Add comments in the schema to document complex changes

**Example:**
```bash
# Adding a new emotion analysis feature
npx prisma migrate dev --name add-emotion-analysis-fields
```

## 2. Running Migrations

### Development Environment
```bash
# Apply pending migrations to development database
npx prisma migrate dev
```

### Testing/Staging Environment
```bash
# Apply migrations to testing/staging database
npx prisma migrate deploy
```

### Production Environment
```bash
# Apply migrations to production database
npx prisma migrate deploy
```

## 3. Rolling Back Migrations

Prisma doesn't provide built-in rollback functionality. Follow these steps instead:

1. Create a new "down" migration that reverses the changes:
```bash
npx prisma migrate dev --name revert_previous_migration
```

2. Manually modify the generated SQL to undo the previous changes

3. Deploy the reversal migration:
```bash
npx prisma migrate deploy
```

## 4. Handling Migration Conflicts

If you encounter conflicts when multiple developers create migrations:

1. Revert your local migration:
```bash
# Delete the latest migration folder from prisma/migrations
rm -rf prisma/migrations/<latest_migration_folder>
```

2. Pull the latest migrations from the repository:
```bash
git pull origin main
```

3. Reset your development database:
```bash
npx prisma migrate reset
```

4. Recreate your migration with the latest schema:
```bash
npx prisma migrate dev --name <descriptive-migration-name>
```

## 5. Database Versioning Approach

- Migrations are tracked in version control within `prisma/migrations/`
- Each migration has an automatically generated timestamp ID
- Migration history is stored in the `_prisma_migrations` table
- Use Prisma's shadow database feature to validate migrations:
```bash
# Enable shadow database in development
DATABASE_URL="postgresql://username:password@localhost:5432/lol_dev"
SHADOW_DATABASE_URL="postgresql://username:password@localhost:5432/lol_shadow"
```

## 6. Migration Best Practices

- **Schema Changes:**
  - Add nullable columns when extending existing tables
  - Use default values for new required fields
  - Create indexes for frequently queried fields

- **Data Migrations:**
  - For complex data transformations, create separate migration scripts:
  ```javascript
  // scripts/migrations/transform-emotion-data.js
  const { PrismaClient } = require('@prisma/client')
  const prisma = new PrismaClient()
  
  async function migrateEmotionData() {
    const posts = await prisma.post.findMany()
    // Transform data
    // Update records
  }
  
  migrateEmotionData()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
  ```

- **Large Tables:**
  - For tables with millions of rows, consider batched migrations
  - Schedule migrations during off-peak hours

## 7. Testing Migrations

1. Create a test database for migration validation:
```bash
# Create a test database clone
createdb lol_migration_test

# Apply migrations to test database
DATABASE_URL=postgresql://username:password@localhost:5432/lol_migration_test npx prisma migrate deploy
```

2. Run automated tests against the migrated schema:
```bash
# Run migration tests
npm run test:migrations
```

3. Verify data integrity:
```bash
# Run data validation scripts
node scripts/validate-migration-data.js
```

## 8. Deployment Considerations

### CI/CD Integration
```yaml
# Example GitHub Actions workflow step
- name: Apply Database Migrations
  run: npx prisma migrate deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Production Deployment Checklist

- ✅ Backup the production database before migration
- ✅ Schedule migrations during low-traffic periods
- ✅ Test migrations on a staging environment with production data clone
- ✅ Monitor database performance during and after migration
- ✅ Have a rollback plan ready
- ✅ Update application version to match schema version

### Monitoring Migrations

```bash
# Check migration status
npx prisma migrate status

# Verify database schema matches Prisma schema
npx prisma db pull --print
```

## Common Commands Reference

```bash
# Generate Prisma client after migrations
npx prisma generate

# Reset development database (CAUTION: deletes all data)
npx prisma migrate reset

# View current database schema
npx prisma db pull

# Format Prisma schema file
npx prisma format
```

For issues or questions about migrations, contact the DevOps team or refer to the [Prisma Migration documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate).
[2025-03-06T09:25:00.806Z] [INFO] [LLM:99z7ceei0le] Request to anthropic/claude-3.7-sonnet
[2025-03-06T09:25:00.806Z] [INFO] [LLM:99z7ceei0le] LLM Request
[2025-03-06T09:25:00.806Z] [INFO] [LLM:99z7ceei0le] Data: 
  You are an expert software engineering workflow architect.
  Create a detailed command prompt file to guide developers through a specific workflow.
  The command prompt should be comprehensive, accurate, and follow best practices.
  
  PROJECT NAME: lol
  
  PROJECT DESCRIPTION: 
  # **lol: Authentic Moments, Enhanced by AI**

> *A social app that uses AI to create genuine, expressive interactions between friends without the pressure of perfect posts.*

## Concept Overview
lol reimagines the authenticity movement pioneered by BeReal, addressing the platform's declining engagement by introducing AI-powered features that enhance genuine social connections rather than replacing them. The app maintains the core "2-minute window" for posting unfiltered content from both cameras but adds AI companions that help users express themselves, analyze emotional contexts, and create meaningful interactions with friends. 

Targeting Gen Z and Alpha users (16-25 as the primary demographic), lol taps into the proven desire for authentic social media while solving the "mundane content problem" that has plagued BeReal. By 2025, with ATT opt-in rates reaching 35% and AI integration becoming standard (88% of marketers using AI daily), the timing is perfect for a platform that thoughtfully combines authenticity with AI enhancement.

## Core Features

* **Emotion-Enhanced Captures**: The dual-camera system analyzes facial expressions and environmental context, subtly enhancing the mood of photos through AI-generated visual elements (like weather effects that match your emotional state) while preserving the authentic moment.

* **AI Memory Journals**: The app creates private, personalized memory collections by recognizing patterns in your daily posts, helping you appreciate the evolution of your routines, relationships, and environments over time.

* **Contextual Prompts**: Unlike BeReal's generic notification, AI analyzes your typical daily patterns and sends notifications during potentially meaningful moments (significant location changes, gatherings with friends, or unusual activities).

* **Friend Insights**: An AI companion analyzes mutual interactions and suggests meaningful ways to engage with friends based on their recent posts, moods, and shared experiences, deepening connections beyond superficial likes.

* **Authentic Reactions**: Replace generic emoji reactions with AI-generated personalized responses that match your speaking style and relationship with each friend, making digital interactions feel more genuine.

## User Experience

lol maintains a minimalist, monochromatic interface with intuitive gestures that emphasize content over UI. The daily notification prompts users to capture their moment within 2 minutes, but the AI-enhanced camera subtly detects emotions and environmental context to add gentle visual enhancements that amplify the mood without filtering reality. Users can toggle between "Pure Real" (unenhanced) and "Feel Real" (AI-enhanced) modes.

The social feed shows friends' daily moments with their emotion indicators, and tapping on posts reveals AI-suggested personal responses based on your relationship history. The Memory Journal provides a private space where users can see AI-curated collections of their own moments, organized by emotional patterns, locations, or significant life changes detected over time.

## Technical Implementation

The app leverages Next.js with React Server Components for the frontend and Vercel Edge Functions for real-time AI processing. The core architecture includes:

1. **Durable Objects** for maintaining stateful chat rooms and user sessions, eliminating the connection issues that plagued BeReal
2. **OpenRouter integration** for accessing multiple AI models specialized in emotion recognition and content generation
3. **Upstash Redis** for fast, serverless data storage of user interactions and preferences
4. **Neon PostgreSQL** for structured data and relationship mapping between users
5. **Mastra workflow engine** for orchestrating complex AI analysis tasks across multiple services

The dual-camera capture system uses TensorFlow.js for on-device emotion analysis before sending data to more powerful server-side models for enhancement generation.

## Go-To-Market Strategy

Launch strategy centers on university campuses with a "Friend Circles" approach – users can only join if invited by 3+ existing members, creating trusted networks from the start. The app will leverage the "2-minute authenticity window" as a shareable moment, encouraging users to post their lol captures to other platforms with "This is how I really felt" messaging.

Growth will be driven by weekly AI-generated "Friendship Stories" that highlight meaningful connections between users and can be shared externally. Partnerships with mental health organizations will position the app as promoting digital well-being through authentic expression rather than performance.

## Resources & Inspiration

* [Reliable UX for AI Chat with Durable Objects](https://sunilpai.dev/posts/reliable-ux-for-ai-chat-with-durable-objects/) – Essential architecture for creating persistent, reliable real-time experiences without the disconnection issues that plagued BeReal.

* [Mastra Workflow Engine](https://github.com/zackees/mastra) – Provides the sophisticated state management needed for complex AI analysis of emotions and social contexts.

* [Priompt](https://github.com/anysphere/priompt) – JSX-based prompt design library perfect for creating the contextual, personalized AI interactions central to the app.

* [Emotion AI in Mobile Apps](https://www.affectiva.com/emotion-ai-overview) – Implementation frameworks for the facial expression recognition that powers the emotional enhancement features.

* [BeReal's Success Factors Analysis](https://www.businessofapps.com/data/bereal-statistics/) – Comprehensive understanding of what worked (and what didn't) in BeReal's approach to authentic social media.

* [Gen Alpha and Gen Z AI Companions](https://www.gartner.com/en/articles/what-gen-z-and-millennials-want-from-generative-ai) – Research on how younger generations interact with AI companions, showing preference for empathetic, playful interactions.

* [Upstash + Next.js Integration](https://github.com/upstash/jstack) – Optimal patterns for building low-cost serverless apps with Redis KV storage and Next.js.
  
  TECH STACK:
  {
  "frameworks": [
    "next.js",
    "react"
  ],
  "libraries": [
    "tailwindcss",
    "framer-motion",
    "shadcn-ui",
    "react-query"
  ],
  "apis": [
    "restful",
    "graphql"
  ],
  "tools": [
    "typescript",
    "eslint",
    "prisma"
  ],
  "documentationLinks": {
    "next.js": "https://nextjs.org/",
    "react": "https://reactjs.org/",
    "tailwindcss": "https://tailwindcss.com/",
    "framer-motion": "https://www.framer.com/motion/",
    "shadcn-ui": "https://ui.shadcn.com/",
    "react-query": "https://tanstack.com/query/latest",
    "graphql": "https://graphql.org/",
    "restful": "https://restfulapi.net/",
    "typescript": "https://www.typescriptlang.org/",
    "eslint": "https://eslint.org/",
    "prisma": "https://www.prisma.io/"
  }
}
  
  COMMAND PROMPT DETAILS:
  Filename: ai-integration.md
  Rationale: The core value proposition of lol is AI-enhanced social interactions, requiring clear documentation on integrating and configuring various AI services for emotion recognition, content generation, and contextual analysis.
  Sections to cover: AI architecture overview, OpenRouter API integration, TensorFlow.js setup for on-device emotion analysis, Server-side AI model configuration, Emotion recognition implementation, Content enhancement workflows, AI memory journal generation, Testing and tuning AI features, Privacy considerations for AI data
  Tech considerations: Include specific integration patterns for TensorFlow.js in a Next.js application, and how to optimize AI processing between client and server using React Server Components.
  
  Guidelines for creating this command prompt:
  1. Start with a brief overview of what this command prompt is for
  2. Include a prerequisites section if applicable
  3. Structure the commands in a logical workflow sequence
  4. For each command, explain what it does and any parameters
  5. Include example output where helpful
  6. Add troubleshooting tips for common issues
  7. Use markdown formatting for better readability
  
  Return ONLY the content of the command prompt file in markdown format, no additional explanations.

[2025-03-06T09:25:00.807Z] [INFO] [LLM:99z7ceei0le] Using base URL: http://localhost:9000
[2025-03-06T09:25:00.808Z] [INFO] [LLM:9onrreo5wyd] Request to anthropic/claude-3.7-sonnet
[2025-03-06T09:25:00.808Z] [INFO] [LLM:9onrreo5wyd] LLM Request
[2025-03-06T09:25:00.808Z] [INFO] [LLM:9onrreo5wyd] Data: 
  You are an expert software engineering workflow architect.
  Create a detailed command prompt file to guide developers through a specific workflow.
  The command prompt should be comprehensive, accurate, and follow best practices.
  
  PROJECT NAME: lol
  
  PROJECT DESCRIPTION: 
  # **lol: Authentic Moments, Enhanced by AI**

> *A social app that uses AI to create genuine, expressive interactions between friends without the pressure of perfect posts.*

## Concept Overview
lol reimagines the authenticity movement pioneered by BeReal, addressing the platform's declining engagement by introducing AI-powered features that enhance genuine social connections rather than replacing them. The app maintains the core "2-minute window" for posting unfiltered content from both cameras but adds AI companions that help users express themselves, analyze emotional contexts, and create meaningful interactions with friends. 

Targeting Gen Z and Alpha users (16-25 as the primary demographic), lol taps into the proven desire for authentic social media while solving the "mundane content problem" that has plagued BeReal. By 2025, with ATT opt-in rates reaching 35% and AI integration becoming standard (88% of marketers using AI daily), the timing is perfect for a platform that thoughtfully combines authenticity with AI enhancement.

## Core Features

* **Emotion-Enhanced Captures**: The dual-camera system analyzes facial expressions and environmental context, subtly enhancing the mood of photos through AI-generated visual elements (like weather effects that match your emotional state) while preserving the authentic moment.

* **AI Memory Journals**: The app creates private, personalized memory collections by recognizing patterns in your daily posts, helping you appreciate the evolution of your routines, relationships, and environments over time.

* **Contextual Prompts**: Unlike BeReal's generic notification, AI analyzes your typical daily patterns and sends notifications during potentially meaningful moments (significant location changes, gatherings with friends, or unusual activities).

* **Friend Insights**: An AI companion analyzes mutual interactions and suggests meaningful ways to engage with friends based on their recent posts, moods, and shared experiences, deepening connections beyond superficial likes.

* **Authentic Reactions**: Replace generic emoji reactions with AI-generated personalized responses that match your speaking style and relationship with each friend, making digital interactions feel more genuine.

## User Experience

lol maintains a minimalist, monochromatic interface with intuitive gestures that emphasize content over UI. The daily notification prompts users to capture their moment within 2 minutes, but the AI-enhanced camera subtly detects emotions and environmental context to add gentle visual enhancements that amplify the mood without filtering reality. Users can toggle between "Pure Real" (unenhanced) and "Feel Real" (AI-enhanced) modes.

The social feed shows friends' daily moments with their emotion indicators, and tapping on posts reveals AI-suggested personal responses based on your relationship history. The Memory Journal provides a private space where users can see AI-curated collections of their own moments, organized by emotional patterns, locations, or significant life changes detected over time.

## Technical Implementation

The app leverages Next.js with React Server Components for the frontend and Vercel Edge Functions for real-time AI processing. The core architecture includes:

1. **Durable Objects** for maintaining stateful chat rooms and user sessions, eliminating the connection issues that plagued BeReal
2. **OpenRouter integration** for accessing multiple AI models specialized in emotion recognition and content generation
3. **Upstash Redis** for fast, serverless data storage of user interactions and preferences
4. **Neon PostgreSQL** for structured data and relationship mapping between users
5. **Mastra workflow engine** for orchestrating complex AI analysis tasks across multiple services

The dual-camera capture system uses TensorFlow.js for on-device emotion analysis before sending data to more powerful server-side models for enhancement generation.

## Go-To-Market Strategy

Launch strategy centers on university campuses with a "Friend Circles" approach – users can only join if invited by 3+ existing members, creating trusted networks from the start. The app will leverage the "2-minute authenticity window" as a shareable moment, encouraging users to post their lol captures to other platforms with "This is how I really felt" messaging.

Growth will be driven by weekly AI-generated "Friendship Stories" that highlight meaningful connections between users and can be shared externally. Partnerships with mental health organizations will position the app as promoting digital well-being through authentic expression rather than performance.

## Resources & Inspiration

* [Reliable UX for AI Chat with Durable Objects](https://sunilpai.dev/posts/reliable-ux-for-ai-chat-with-durable-objects/) – Essential architecture for creating persistent, reliable real-time experiences without the disconnection issues that plagued BeReal.

* [Mastra Workflow Engine](https://github.com/zackees/mastra) – Provides the sophisticated state management needed for complex AI analysis of emotions and social contexts.

* [Priompt](https://github.com/anysphere/priompt) – JSX-based prompt design library perfect for creating the contextual, personalized AI interactions central to the app.

* [Emotion AI in Mobile Apps](https://www.affectiva.com/emotion-ai-overview) – Implementation frameworks for the facial expression recognition that powers the emotional enhancement features.

* [BeReal's Success Factors Analysis](https://www.businessofapps.com/data/bereal-statistics/) – Comprehensive understanding of what worked (and what didn't) in BeReal's approach to authentic social media.

* [Gen Alpha and Gen Z AI Companions](https://www.gartner.com/en/articles/what-gen-z-and-millennials-want-from-generative-ai) – Research on how younger generations interact with AI companions, showing preference for empathetic, playful interactions.

* [Upstash + Next.js Integration](https://github.com/upstash/jstack) – Optimal patterns for building low-cost serverless apps with Redis KV storage and Next.js.
  
  TECH STACK:
  {
  "frameworks": [
    "next.js",
    "react"
  ],
  "libraries": [
    "tailwindcss",
    "framer-motion",
    "shadcn-ui",
    "react-query"
  ],
  "apis": [
    "restful",
    "graphql"
  ],
  "tools": [
    "typescript",
    "eslint",
    "prisma"
  ],
  "documentationLinks": {
    "next.js": "https://nextjs.org/",
    "react": "https://reactjs.org/",
    "tailwindcss": "https://tailwindcss.com/",
    "framer-motion": "https://www.framer.com/motion/",
    "shadcn-ui": "https://ui.shadcn.com/",
    "react-query": "https://tanstack.com/query/latest",
    "graphql": "https://graphql.org/",
    "restful": "https://restfulapi.net/",
    "typescript": "https://www.typescriptlang.org/",
    "eslint": "https://eslint.org/",
    "prisma": "https://www.prisma.io/"
  }
}
  
  COMMAND PROMPT DETAILS:
  Filename: camera-system.md
  Rationale: The dual-camera capture system is a fundamental feature that requires specialized implementation for capturing, processing, and enhancing photos with emotion recognition.
  Sections to cover: Camera API implementation, Dual-camera capture workflow, On-device image processing, Emotion detection integration, AI enhancement pipeline, Performance optimization for mobile devices, Camera permissions handling, Fallback strategies for unsupported devices
  Tech considerations: Focus on browser compatibility issues with camera APIs, performance considerations for real-time processing with TensorFlow.js, and integration with the AI enhancement pipeline.
  
  Guidelines for creating this command prompt:
  1. Start with a brief overview of what this command prompt is for
  2. Include a prerequisites section if applicable
  3. Structure the commands in a logical workflow sequence
  4. For each command, explain what it does and any parameters
  5. Include example output where helpful
  6. Add troubleshooting tips for common issues
  7. Use markdown formatting for better readability
  
  Return ONLY the content of the command prompt file in markdown format, no additional explanations.

[2025-03-06T09:25:00.808Z] [INFO] [LLM:9onrreo5wyd] Using base URL: http://localhost:9000
[2025-03-06T09:25:00.809Z] [INFO] [LLM:r0c1n5jsxrm] Request to anthropic/claude-3.7-sonnet
[2025-03-06T09:25:00.809Z] [INFO] [LLM:r0c1n5jsxrm] LLM Request
[2025-03-06T09:25:00.809Z] [INFO] [LLM:r0c1n5jsxrm] Data: 
  You are an expert software engineering workflow architect.
  Create a detailed command prompt file to guide developers through a specific workflow.
  The command prompt should be comprehensive, accurate, and follow best practices.
  
  PROJECT NAME: lol
  
  PROJECT DESCRIPTION: 
  # **lol: Authentic Moments, Enhanced by AI**

> *A social app that uses AI to create genuine, expressive interactions between friends without the pressure of perfect posts.*

## Concept Overview
lol reimagines the authenticity movement pioneered by BeReal, addressing the platform's declining engagement by introducing AI-powered features that enhance genuine social connections rather than replacing them. The app maintains the core "2-minute window" for posting unfiltered content from both cameras but adds AI companions that help users express themselves, analyze emotional contexts, and create meaningful interactions with friends. 

Targeting Gen Z and Alpha users (16-25 as the primary demographic), lol taps into the proven desire for authentic social media while solving the "mundane content problem" that has plagued BeReal. By 2025, with ATT opt-in rates reaching 35% and AI integration becoming standard (88% of marketers using AI daily), the timing is perfect for a platform that thoughtfully combines authenticity with AI enhancement.

## Core Features

* **Emotion-Enhanced Captures**: The dual-camera system analyzes facial expressions and environmental context, subtly enhancing the mood of photos through AI-generated visual elements (like weather effects that match your emotional state) while preserving the authentic moment.

* **AI Memory Journals**: The app creates private, personalized memory collections by recognizing patterns in your daily posts, helping you appreciate the evolution of your routines, relationships, and environments over time.

* **Contextual Prompts**: Unlike BeReal's generic notification, AI analyzes your typical daily patterns and sends notifications during potentially meaningful moments (significant location changes, gatherings with friends, or unusual activities).

* **Friend Insights**: An AI companion analyzes mutual interactions and suggests meaningful ways to engage with friends based on their recent posts, moods, and shared experiences, deepening connections beyond superficial likes.

* **Authentic Reactions**: Replace generic emoji reactions with AI-generated personalized responses that match your speaking style and relationship with each friend, making digital interactions feel more genuine.

## User Experience

lol maintains a minimalist, monochromatic interface with intuitive gestures that emphasize content over UI. The daily notification prompts users to capture their moment within 2 minutes, but the AI-enhanced camera subtly detects emotions and environmental context to add gentle visual enhancements that amplify the mood without filtering reality. Users can toggle between "Pure Real" (unenhanced) and "Feel Real" (AI-enhanced) modes.

The social feed shows friends' daily moments with their emotion indicators, and tapping on posts reveals AI-suggested personal responses based on your relationship history. The Memory Journal provides a private space where users can see AI-curated collections of their own moments, organized by emotional patterns, locations, or significant life changes detected over time.

## Technical Implementation

The app leverages Next.js with React Server Components for the frontend and Vercel Edge Functions for real-time AI processing. The core architecture includes:

1. **Durable Objects** for maintaining stateful chat rooms and user sessions, eliminating the connection issues that plagued BeReal
2. **OpenRouter integration** for accessing multiple AI models specialized in emotion recognition and content generation
3. **Upstash Redis** for fast, serverless data storage of user interactions and preferences
4. **Neon PostgreSQL** for structured data and relationship mapping between users
5. **Mastra workflow engine** for orchestrating complex AI analysis tasks across multiple services

The dual-camera capture system uses TensorFlow.js for on-device emotion analysis before sending data to more powerful server-side models for enhancement generation.

## Go-To-Market Strategy

Launch strategy centers on university campuses with a "Friend Circles" approach – users can only join if invited by 3+ existing members, creating trusted networks from the start. The app will leverage the "2-minute authenticity window" as a shareable moment, encouraging users to post their lol captures to other platforms with "This is how I really felt" messaging.

Growth will be driven by weekly AI-generated "Friendship Stories" that highlight meaningful connections between users and can be shared externally. Partnerships with mental health organizations will position the app as promoting digital well-being through authentic expression rather than performance.

## Resources & Inspiration

* [Reliable UX for AI Chat with Durable Objects](https://sunilpai.dev/posts/reliable-ux-for-ai-chat-with-durable-objects/) – Essential architecture for creating persistent, reliable real-time experiences without the disconnection issues that plagued BeReal.

* [Mastra Workflow Engine](https://github.com/zackees/mastra) – Provides the sophisticated state management needed for complex AI analysis of emotions and social contexts.

* [Priompt](https://github.com/anysphere/priompt) – JSX-based prompt design library perfect for creating the contextual, personalized AI interactions central to the app.

* [Emotion AI in Mobile Apps](https://www.affectiva.com/emotion-ai-overview) – Implementation frameworks for the facial expression recognition that powers the emotional enhancement features.

* [BeReal's Success Factors Analysis](https://www.businessofapps.com/data/bereal-statistics/) – Comprehensive understanding of what worked (and what didn't) in BeReal's approach to authentic social media.

* [Gen Alpha and Gen Z AI Companions](https://www.gartner.com/en/articles/what-gen-z-and-millennials-want-from-generative-ai) – Research on how younger generations interact with AI companions, showing preference for empathetic, playful interactions.

* [Upstash + Next.js Integration](https://github.com/upstash/jstack) – Optimal patterns for building low-cost serverless apps with Redis KV storage and Next.js.
  
  TECH STACK:
  {
  "frameworks": [
    "next.js",
    "react"
  ],
  "libraries": [
    "tailwindcss",
    "framer-motion",
    "shadcn-ui",
    "react-query"
  ],
  "apis": [
    "restful",
    "graphql"
  ],
  "tools": [
    "typescript",
    "eslint",
    "prisma"
  ],
  "documentationLinks": {
    "next.js": "https://nextjs.org/",
    "react": "https://reactjs.org/",
    "tailwindcss": "https://tailwindcss.com/",
    "framer-motion": "https://www.framer.com/motion/",
    "shadcn-ui": "https://ui.shadcn.com/",
    "react-query": "https://tanstack.com/query/latest",
    "graphql": "https://graphql.org/",
    "restful": "https://restfulapi.net/",
    "typescript": "https://www.typescriptlang.org/",
    "eslint": "https://eslint.org/",
    "prisma": "https://www.prisma.io/"
  }
}
  
  COMMAND PROMPT DETAILS:
  Filename: realtime-features.md
  Rationale: The application requires robust real-time features for notifications, friend activities, and interactions, leveraging Durable Objects for stateful connections.
  Sections to cover: Durable Objects architecture overview, Setting up persistent connections, Real-time notification system, Friend activity streams, Chat and interaction implementation, State synchronization patterns, Handling network disruptions, Testing real-time features
  Tech considerations: Provide detailed implementation patterns for Durable Objects with Next.js and Vercel, focusing on connection reliability and state management across devices.
  
  Guidelines for creating this command prompt:
  1. Start with a brief overview of what this command prompt is for
  2. Include a prerequisites section if applicable
  3. Structure the commands in a logical workflow sequence
  4. For each command, explain what it does and any parameters
  5. Include example output where helpful
  6. Add troubleshooting tips for common issues
  7. Use markdown formatting for better readability
  
  Return ONLY the content of the command prompt file in markdown format, no additional explanations.

[2025-03-06T09:25:00.810Z] [INFO] [LLM:r0c1n5jsxrm] Using base URL: http://localhost:9000
[2025-03-06T09:25:00.810Z] [INFO] [LLM:na6x8harqqh] Request to anthropic/claude-3.7-sonnet
[2025-03-06T09:25:00.810Z] [INFO] [LLM:na6x8harqqh] LLM Request
[2025-03-06T09:25:00.810Z] [INFO] [LLM:na6x8harqqh] Data: 
  You are an expert software engineering workflow architect.
  Create a detailed command prompt file to guide developers through a specific workflow.
  The command prompt should be comprehensive, accurate, and follow best practices.
  
  PROJECT NAME: lol
  
  PROJECT DESCRIPTION: 
  # **lol: Authentic Moments, Enhanced by AI**

> *A social app that uses AI to create genuine, expressive interactions between friends without the pressure of perfect posts.*

## Concept Overview
lol reimagines the authenticity movement pioneered by BeReal, addressing the platform's declining engagement by introducing AI-powered features that enhance genuine social connections rather than replacing them. The app maintains the core "2-minute window" for posting unfiltered content from both cameras but adds AI companions that help users express themselves, analyze emotional contexts, and create meaningful interactions with friends. 

Targeting Gen Z and Alpha users (16-25 as the primary demographic), lol taps into the proven desire for authentic social media while solving the "mundane content problem" that has plagued BeReal. By 2025, with ATT opt-in rates reaching 35% and AI integration becoming standard (88% of marketers using AI daily), the timing is perfect for a platform that thoughtfully combines authenticity with AI enhancement.

## Core Features

* **Emotion-Enhanced Captures**: The dual-camera system analyzes facial expressions and environmental context, subtly enhancing the mood of photos through AI-generated visual elements (like weather effects that match your emotional state) while preserving the authentic moment.

* **AI Memory Journals**: The app creates private, personalized memory collections by recognizing patterns in your daily posts, helping you appreciate the evolution of your routines, relationships, and environments over time.

* **Contextual Prompts**: Unlike BeReal's generic notification, AI analyzes your typical daily patterns and sends notifications during potentially meaningful moments (significant location changes, gatherings with friends, or unusual activities).

* **Friend Insights**: An AI companion analyzes mutual interactions and suggests meaningful ways to engage with friends based on their recent posts, moods, and shared experiences, deepening connections beyond superficial likes.

* **Authentic Reactions**: Replace generic emoji reactions with AI-generated personalized responses that match your speaking style and relationship with each friend, making digital interactions feel more genuine.

## User Experience

lol maintains a minimalist, monochromatic interface with intuitive gestures that emphasize content over UI. The daily notification prompts users to capture their moment within 2 minutes, but the AI-enhanced camera subtly detects emotions and environmental context to add gentle visual enhancements that amplify the mood without filtering reality. Users can toggle between "Pure Real" (unenhanced) and "Feel Real" (AI-enhanced) modes.

The social feed shows friends' daily moments with their emotion indicators, and tapping on posts reveals AI-suggested personal responses based on your relationship history. The Memory Journal provides a private space where users can see AI-curated collections of their own moments, organized by emotional patterns, locations, or significant life changes detected over time.

## Technical Implementation

The app leverages Next.js with React Server Components for the frontend and Vercel Edge Functions for real-time AI processing. The core architecture includes:

1. **Durable Objects** for maintaining stateful chat rooms and user sessions, eliminating the connection issues that plagued BeReal
2. **OpenRouter integration** for accessing multiple AI models specialized in emotion recognition and content generation
3. **Upstash Redis** for fast, serverless data storage of user interactions and preferences
4. **Neon PostgreSQL** for structured data and relationship mapping between users
5. **Mastra workflow engine** for orchestrating complex AI analysis tasks across multiple services

The dual-camera capture system uses TensorFlow.js for on-device emotion analysis before sending data to more powerful server-side models for enhancement generation.

## Go-To-Market Strategy

Launch strategy centers on university campuses with a "Friend Circles" approach – users can only join if invited by 3+ existing members, creating trusted networks from the start. The app will leverage the "2-minute authenticity window" as a shareable moment, encouraging users to post their lol captures to other platforms with "This is how I really felt" messaging.

Growth will be driven by weekly AI-generated "Friendship Stories" that highlight meaningful connections between users and can be shared externally. Partnerships with mental health organizations will position the app as promoting digital well-being through authentic expression rather than performance.

## Resources & Inspiration

* [Reliable UX for AI Chat with Durable Objects](https://sunilpai.dev/posts/reliable-ux-for-ai-chat-with-durable-objects/) – Essential architecture for creating persistent, reliable real-time experiences without the disconnection issues that plagued BeReal.

* [Mastra Workflow Engine](https://github.com/zackees/mastra) – Provides the sophisticated state management needed for complex AI analysis of emotions and social contexts.

* [Priompt](https://github.com/anysphere/priompt) – JSX-based prompt design library perfect for creating the contextual, personalized AI interactions central to the app.

* [Emotion AI in Mobile Apps](https://www.affectiva.com/emotion-ai-overview) – Implementation frameworks for the facial expression recognition that powers the emotional enhancement features.

* [BeReal's Success Factors Analysis](https://www.businessofapps.com/data/bereal-statistics/) – Comprehensive understanding of what worked (and what didn't) in BeReal's approach to authentic social media.

* [Gen Alpha and Gen Z AI Companions](https://www.gartner.com/en/articles/what-gen-z-and-millennials-want-from-generative-ai) – Research on how younger generations interact with AI companions, showing preference for empathetic, playful interactions.

* [Upstash + Next.js Integration](https://github.com/upstash/jstack) – Optimal patterns for building low-cost serverless apps with Redis KV storage and Next.js.
  
  TECH STACK:
  {
  "frameworks": [
    "next.js",
    "react"
  ],
  "libraries": [
    "tailwindcss",
    "framer-motion",
    "shadcn-ui",
    "react-query"
  ],
  "apis": [
    "restful",
    "graphql"
  ],
  "tools": [
    "typescript",
    "eslint",
    "prisma"
  ],
  "documentationLinks": {
    "next.js": "https://nextjs.org/",
    "react": "https://reactjs.org/",
    "tailwindcss": "https://tailwindcss.com/",
    "framer-motion": "https://www.framer.com/motion/",
    "shadcn-ui": "https://ui.shadcn.com/",
    "react-query": "https://tanstack.com/query/latest",
    "graphql": "https://graphql.org/",
    "restful": "https://restfulapi.net/",
    "typescript": "https://www.typescriptlang.org/",
    "eslint": "https://eslint.org/",
    "prisma": "https://www.prisma.io/"
  }
}
  
  COMMAND PROMPT DETAILS:
  Filename: workflow-engine.md
  Rationale: The Mastra workflow engine is used for orchestrating complex AI analysis tasks and requires specific implementation guidance for developers.
  Sections to cover: Mastra workflow engine setup, Defining AI analysis workflows, Emotion recognition pipeline, Memory journal generation workflow, Friend insights generation, Error handling and retries, Monitoring workflow execution, Testing and debugging workflows
  Tech considerations: Include specific examples of how to integrate Mastra with the Next.js application architecture and how to optimize for serverless execution environments.
  
  Guidelines for creating this command prompt:
  1. Start with a brief overview of what this command prompt is for
  2. Include a prerequisites section if applicable
  3. Structure the commands in a logical workflow sequence
  4. For each command, explain what it does and any parameters
  5. Include example output where helpful
  6. Add troubleshooting tips for common issues
  7. Use markdown formatting for better readability
  
  Return ONLY the content of the command prompt file in markdown format, no additional explanations.

[2025-03-06T09:25:00.810Z] [INFO] [LLM:na6x8harqqh] Using base URL: http://localhost:9000
[2025-03-06T09:25:00.810Z] [INFO] [LLM:cb3sqlqadbv] Request to anthropic/claude-3.7-sonnet
[2025-03-06T09:25:00.810Z] [INFO] [LLM:cb3sqlqadbv] LLM Request
[2025-03-06T09:25:00.810Z] [INFO] [LLM:cb3sqlqadbv] Data: 
  You are an expert software engineering workflow architect.
  Create a detailed command prompt file to guide developers through a specific workflow.
  The command prompt should be comprehensive, accurate, and follow best practices.
  
  PROJECT NAME: lol
  
  PROJECT DESCRIPTION: 
  # **lol: Authentic Moments, Enhanced by AI**

> *A social app that uses AI to create genuine, expressive interactions between friends without the pressure of perfect posts.*

## Concept Overview
lol reimagines the authenticity movement pioneered by BeReal, addressing the platform's declining engagement by introducing AI-powered features that enhance genuine social connections rather than replacing them. The app maintains the core "2-minute window" for posting unfiltered content from both cameras but adds AI companions that help users express themselves, analyze emotional contexts, and create meaningful interactions with friends. 

Targeting Gen Z and Alpha users (16-25 as the primary demographic), lol taps into the proven desire for authentic social media while solving the "mundane content problem" that has plagued BeReal. By 2025, with ATT opt-in rates reaching 35% and AI integration becoming standard (88% of marketers using AI daily), the timing is perfect for a platform that thoughtfully combines authenticity with AI enhancement.

## Core Features

* **Emotion-Enhanced Captures**: The dual-camera system analyzes facial expressions and environmental context, subtly enhancing the mood of photos through AI-generated visual elements (like weather effects that match your emotional state) while preserving the authentic moment.

* **AI Memory Journals**: The app creates private, personalized memory collections by recognizing patterns in your daily posts, helping you appreciate the evolution of your routines, relationships, and environments over time.

* **Contextual Prompts**: Unlike BeReal's generic notification, AI analyzes your typical daily patterns and sends notifications during potentially meaningful moments (significant location changes, gatherings with friends, or unusual activities).

* **Friend Insights**: An AI companion analyzes mutual interactions and suggests meaningful ways to engage with friends based on their recent posts, moods, and shared experiences, deepening connections beyond superficial likes.

* **Authentic Reactions**: Replace generic emoji reactions with AI-generated personalized responses that match your speaking style and relationship with each friend, making digital interactions feel more genuine.

## User Experience

lol maintains a minimalist, monochromatic interface with intuitive gestures that emphasize content over UI. The daily notification prompts users to capture their moment within 2 minutes, but the AI-enhanced camera subtly detects emotions and environmental context to add gentle visual enhancements that amplify the mood without filtering reality. Users can toggle between "Pure Real" (unenhanced) and "Feel Real" (AI-enhanced) modes.

The social feed shows friends' daily moments with their emotion indicators, and tapping on posts reveals AI-suggested personal responses based on your relationship history. The Memory Journal provides a private space where users can see AI-curated collections of their own moments, organized by emotional patterns, locations, or significant life changes detected over time.

## Technical Implementation

The app leverages Next.js with React Server Components for the frontend and Vercel Edge Functions for real-time AI processing. The core architecture includes:

1. **Durable Objects** for maintaining stateful chat rooms and user sessions, eliminating the connection issues that plagued BeReal
2. **OpenRouter integration** for accessing multiple AI models specialized in emotion recognition and content generation
3. **Upstash Redis** for fast, serverless data storage of user interactions and preferences
4. **Neon PostgreSQL** for structured data and relationship mapping between users
5. **Mastra workflow engine** for orchestrating complex AI analysis tasks across multiple services

The dual-camera capture system uses TensorFlow.js for on-device emotion analysis before sending data to more powerful server-side models for enhancement generation.

## Go-To-Market Strategy

Launch strategy centers on university campuses with a "Friend Circles" approach – users can only join if invited by 3+ existing members, creating trusted networks from the start. The app will leverage the "2-minute authenticity window" as a shareable moment, encouraging users to post their lol captures to other platforms with "This is how I really felt" messaging.

Growth will be driven by weekly AI-generated "Friendship Stories" that highlight meaningful connections between users and can be shared externally. Partnerships with mental health organizations will position the app as promoting digital well-being through authentic expression rather than performance.

## Resources & Inspiration

* [Reliable UX for AI Chat with Durable Objects](https://sunilpai.dev/posts/reliable-ux-for-ai-chat-with-durable-objects/) – Essential architecture for creating persistent, reliable real-time experiences without the disconnection issues that plagued BeReal.

* [Mastra Workflow Engine](https://github.com/zackees/mastra) – Provides the sophisticated state management needed for complex AI analysis of emotions and social contexts.

* [Priompt](https://github.com/anysphere/priompt) – JSX-based prompt design library perfect for creating the contextual, personalized AI interactions central to the app.

* [Emotion AI in Mobile Apps](https://www.affectiva.com/emotion-ai-overview) – Implementation frameworks for the facial expression recognition that powers the emotional enhancement features.

* [BeReal's Success Factors Analysis](https://www.businessofapps.com/data/bereal-statistics/) – Comprehensive understanding of what worked (and what didn't) in BeReal's approach to authentic social media.

* [Gen Alpha and Gen Z AI Companions](https://www.gartner.com/en/articles/what-gen-z-and-millennials-want-from-generative-ai) – Research on how younger generations interact with AI companions, showing preference for empathetic, playful interactions.

* [Upstash + Next.js Integration](https://github.com/upstash/jstack) – Optimal patterns for building low-cost serverless apps with Redis KV storage and Next.js.
  
  TECH STACK:
  {
  "frameworks": [
    "next.js",
    "react"
  ],
  "libraries": [
    "tailwindcss",
    "framer-motion",
    "shadcn-ui",
    "react-query"
  ],
  "apis": [
    "restful",
    "graphql"
  ],
  "tools": [
    "typescript",
    "eslint",
    "prisma"
  ],
  "documentationLinks": {
    "next.js": "https://nextjs.org/",
    "react": "https://reactjs.org/",
    "tailwindcss": "https://tailwindcss.com/",
    "framer-motion": "https://www.framer.com/motion/",
    "shadcn-ui": "https://ui.shadcn.com/",
    "react-query": "https://tanstack.com/query/latest",
    "graphql": "https://graphql.org/",
    "restful": "https://restfulapi.net/",
    "typescript": "https://www.typescriptlang.org/",
    "eslint": "https://eslint.org/",
    "prisma": "https://www.prisma.io/"
  }
}
  
  COMMAND PROMPT DETAILS:
  Filename: privacy-security.md
  Rationale: Given the sensitive nature of emotion data, facial recognition, and social interactions, comprehensive privacy and security measures are essential.
  Sections to cover: Data privacy architecture, User consent management, Emotion data handling policies, Image processing privacy safeguards, Friend network security, Data retention and deletion workflows, Compliance considerations (GDPR, CCPA), Security testing procedures
  Tech considerations: Focus on implementing privacy by design principles in the Next.js application, secure data handling with Prisma, and proper encryption for sensitive user data.
  
  Guidelines for creating this command prompt:
  1. Start with a brief overview of what this command prompt is for
  2. Include a prerequisites section if applicable
  3. Structure the commands in a logical workflow sequence
  4. For each command, explain what it does and any parameters
  5. Include example output where helpful
  6. Add troubleshooting tips for common issues
  7. Use markdown formatting for better readability
  
  Return ONLY the content of the command prompt file in markdown format, no additional explanations.

[2025-03-06T09:25:00.811Z] [INFO] [LLM:cb3sqlqadbv] Using base URL: http://localhost:9000
[2025-03-06T09:25:00.812Z] [INFO] [LLM:6lk1m6jv1st] Request to anthropic/claude-3.7-sonnet
[2025-03-06T09:25:00.812Z] [INFO] [LLM:6lk1m6jv1st] LLM Request
[2025-03-06T09:25:00.812Z] [INFO] [LLM:6lk1m6jv1st] Data: 
  You are an expert software engineering workflow architect.
  Create a detailed command prompt file to guide developers through a specific workflow.
  The command prompt should be comprehensive, accurate, and follow best practices.
  
  PROJECT NAME: lol
  
  PROJECT DESCRIPTION: 
  # **lol: Authentic Moments, Enhanced by AI**

> *A social app that uses AI to create genuine, expressive interactions between friends without the pressure of perfect posts.*

## Concept Overview
lol reimagines the authenticity movement pioneered by BeReal, addressing the platform's declining engagement by introducing AI-powered features that enhance genuine social connections rather than replacing them. The app maintains the core "2-minute window" for posting unfiltered content from both cameras but adds AI companions that help users express themselves, analyze emotional contexts, and create meaningful interactions with friends. 

Targeting Gen Z and Alpha users (16-25 as the primary demographic), lol taps into the proven desire for authentic social media while solving the "mundane content problem" that has plagued BeReal. By 2025, with ATT opt-in rates reaching 35% and AI integration becoming standard (88% of marketers using AI daily), the timing is perfect for a platform that thoughtfully combines authenticity with AI enhancement.

## Core Features

* **Emotion-Enhanced Captures**: The dual-camera system analyzes facial expressions and environmental context, subtly enhancing the mood of photos through AI-generated visual elements (like weather effects that match your emotional state) while preserving the authentic moment.

* **AI Memory Journals**: The app creates private, personalized memory collections by recognizing patterns in your daily posts, helping you appreciate the evolution of your routines, relationships, and environments over time.

* **Contextual Prompts**: Unlike BeReal's generic notification, AI analyzes your typical daily patterns and sends notifications during potentially meaningful moments (significant location changes, gatherings with friends, or unusual activities).

* **Friend Insights**: An AI companion analyzes mutual interactions and suggests meaningful ways to engage with friends based on their recent posts, moods, and shared experiences, deepening connections beyond superficial likes.

* **Authentic Reactions**: Replace generic emoji reactions with AI-generated personalized responses that match your speaking style and relationship with each friend, making digital interactions feel more genuine.

## User Experience

lol maintains a minimalist, monochromatic interface with intuitive gestures that emphasize content over UI. The daily notification prompts users to capture their moment within 2 minutes, but the AI-enhanced camera subtly detects emotions and environmental context to add gentle visual enhancements that amplify the mood without filtering reality. Users can toggle between "Pure Real" (unenhanced) and "Feel Real" (AI-enhanced) modes.

The social feed shows friends' daily moments with their emotion indicators, and tapping on posts reveals AI-suggested personal responses based on your relationship history. The Memory Journal provides a private space where users can see AI-curated collections of their own moments, organized by emotional patterns, locations, or significant life changes detected over time.

## Technical Implementation

The app leverages Next.js with React Server Components for the frontend and Vercel Edge Functions for real-time AI processing. The core architecture includes:

1. **Durable Objects** for maintaining stateful chat rooms and user sessions, eliminating the connection issues that plagued BeReal
2. **OpenRouter integration** for accessing multiple AI models specialized in emotion recognition and content generation
3. **Upstash Redis** for fast, serverless data storage of user interactions and preferences
4. **Neon PostgreSQL** for structured data and relationship mapping between users
5. **Mastra workflow engine** for orchestrating complex AI analysis tasks across multiple services

The dual-camera capture system uses TensorFlow.js for on-device emotion analysis before sending data to more powerful server-side models for enhancement generation.

## Go-To-Market Strategy

Launch strategy centers on university campuses with a "Friend Circles" approach – users can only join if invited by 3+ existing members, creating trusted networks from the start. The app will leverage the "2-minute authenticity window" as a shareable moment, encouraging users to post their lol captures to other platforms with "This is how I really felt" messaging.

Growth will be driven by weekly AI-generated "Friendship Stories" that highlight meaningful connections between users and can be shared externally. Partnerships with mental health organizations will position the app as promoting digital well-being through authentic expression rather than performance.

## Resources & Inspiration

* [Reliable UX for AI Chat with Durable Objects](https://sunilpai.dev/posts/reliable-ux-for-ai-chat-with-durable-objects/) – Essential architecture for creating persistent, reliable real-time experiences without the disconnection issues that plagued BeReal.

* [Mastra Workflow Engine](https://github.com/zackees/mastra) – Provides the sophisticated state management needed for complex AI analysis of emotions and social contexts.

* [Priompt](https://github.com/anysphere/priompt) – JSX-based prompt design library perfect for creating the contextual, personalized AI interactions central to the app.

* [Emotion AI in Mobile Apps](https://www.affectiva.com/emotion-ai-overview) – Implementation frameworks for the facial expression recognition that powers the emotional enhancement features.

* [BeReal's Success Factors Analysis](https://www.businessofapps.com/data/bereal-statistics/) – Comprehensive understanding of what worked (and what didn't) in BeReal's approach to authentic social media.

* [Gen Alpha and Gen Z AI Companions](https://www.gartner.com/en/articles/what-gen-z-and-millennials-want-from-generative-ai) – Research on how younger generations interact with AI companions, showing preference for empathetic, playful interactions.

* [Upstash + Next.js Integration](https://github.com/upstash/jstack) – Optimal patterns for building low-cost serverless apps with Redis KV storage and Next.js.
  
  TECH STACK:
  {
  "frameworks": [
    "next.js",
    "react"
  ],
  "libraries": [
    "tailwindcss",
    "framer-motion",
    "shadcn-ui",
    "react-query"
  ],
  "apis": [
    "restful",
    "graphql"
  ],
  "tools": [
    "typescript",
    "eslint",
    "prisma"
  ],
  "documentationLinks": {
    "next.js": "https://nextjs.org/",
    "react": "https://reactjs.org/",
    "tailwindcss": "https://tailwindcss.com/",
    "framer-motion": "https://www.framer.com/motion/",
    "shadcn-ui": "https://ui.shadcn.com/",
    "react-query": "https://tanstack.com/query/latest",
    "graphql": "https://graphql.org/",
    "restful": "https://restfulapi.net/",
    "typescript": "https://www.typescriptlang.org/",
    "eslint": "https://eslint.org/",
    "prisma": "https://www.prisma.io/"
  }
}
  
  COMMAND PROMPT DETAILS:
  Filename: prompt-engineering.md
  Rationale: The application relies heavily on AI prompts for personalized interactions, requiring standardized approaches to prompt design and management using Priompt.
  Sections to cover: Priompt JSX integration, Prompt template management, Contextual prompt generation, Personalization variables, Emotion-aware prompt design, Testing and evaluating prompt effectiveness, Versioning and improving prompts, Prompt security considerations
  Tech considerations: Provide examples of integrating Priompt's JSX-based prompt design with the Next.js and React application architecture, including state management for dynamic prompts.
  
  Guidelines for creating this command prompt:
  1. Start with a brief overview of what this command prompt is for
  2. Include a prerequisites section if applicable
  3. Structure the commands in a logical workflow sequence
  4. For each command, explain what it does and any parameters
  5. Include example output where helpful
  6. Add troubleshooting tips for common issues
  7. Use markdown formatting for better readability
  
  Return ONLY the content of the command prompt file in markdown format, no additional explanations.

[2025-03-06T09:25:00.812Z] [INFO] [LLM:6lk1m6jv1st] Using base URL: http://localhost:9000
[LLM API] Received request
[LLM API] Request params: model=anthropic/claude-3.7-sonnet, temp=0.7
[LLM API] Created simple user message
[LLM API] Calling OpenRouter with model: anthropic/claude-3.7-sonnet
[LLM API] Received request
[LLM API] Received request
[LLM API] Received request
[LLM API] Received request
[LLM API] Received request
[LLM API] Request params: model=anthropic/claude-3.7-sonnet, temp=0.7
[LLM API] Created simple user message
[LLM API] Calling OpenRouter with model: anthropic/claude-3.7-sonnet
[LLM API] Request params: model=anthropic/claude-3.7-sonnet, temp=0.7
[LLM API] Created simple user message
[LLM API] Calling OpenRouter with model: anthropic/claude-3.7-sonnet
[LLM API] Request params: model=anthropic/claude-3.7-sonnet, temp=0.7
[LLM API] Created simple user message
[LLM API] Calling OpenRouter with model: anthropic/claude-3.7-sonnet
[LLM API] Request params: model=anthropic/claude-3.7-sonnet, temp=0.7
[LLM API] Created simple user message
[LLM API] Calling OpenRouter with model: anthropic/claude-3.7-sonnet
[LLM API] Request params: model=anthropic/claude-3.7-sonnet, temp=0.7
[LLM API] Created simple user message
[LLM API] Calling OpenRouter with model: anthropic/claude-3.7-sonnet
[LLM API] Success! Response contains 1 choices
 POST /api/llm 200 in 50437ms
[2025-03-06T09:25:51.263Z] [INFO] [LLM:r0c1n5jsxrm] Response status: 200
[2025-03-06T09:25:51.264Z] [INFO] [LLM:r0c1n5jsxrm] Response length: 13812
[2025-03-06T09:25:51.264Z] [INFO] [LLM:r0c1n5jsxrm] LLM Response
[2025-03-06T09:25:51.264Z] [INFO] [LLM:r0c1n5jsxrm] Data: # Real-time Features Implementation Guide for "lol" App

This command prompt guides developers through implementing robust real-time features for the "lol" social app using Durable Objects for stateful connections, ensuring reliable notifications, friend activity streams, and real-time interactions.

## Prerequisites

- Node.js v18.0.0+
- Cloudflare Workers account with Durable Objects enabled
- Next.js 13+ project with App Router
- Wrangler CLI (`npm install -g wrangler`)
- TypeScript 5.0+
- Basic understanding of WebSockets

## 1. Durable Objects Architecture Setup

### Initialize Cloudflare Worker with Durable Objects

```bash
# Create a new worker with Durable Objects
$ wrangler init lol-realtime-worker
? Would you like to use TypeScript? Yes
? Would you like to create a Worker at lol-realtime-worker/src/index.ts? Yes
? Would you like to use Durable Objects? Yes

# Navigate to the worker directory
$ cd lol-realtime-worker
```

### Define Durable Object Class

Create a `ChatRoom.ts` file in the `src` directory:

```bash
$ touch src/ChatRoom.ts
```

Add the following implementation:

```typescript
# Example output of ChatRoom.ts
export class ChatRoom implements DurableObject {
  private sessions: Map<string, WebSocket> = new Map();
  private state: DurableObjectState;
  private messages: any[] = [];

  constructor(state: DurableObjectState) {
    this.state = state;
    // Load existing messages from storage
    this.state.blockConcurrencyWhile(async () => {
      const storedMessages = await this.state.storage.get("messages");
      this.messages = storedMessages || [];
    });
  }

  async fetch(request: Request) {
    // WebSocket handling logic will go here
    // ...
  }
}
```

### Update Worker Configuration

Edit your `wrangler.toml` file to include Durable Objects:

```bash
$ cat > wrangler.toml << EOF
name = "lol-realtime-worker"
main = "src/index.ts"
compatibility_date = "2023-09-01"

[durable_objects]
bindings = [
  { name = "CHAT_ROOM", class_name = "ChatRoom" }
]

[[migrations]]
tag = "v1"
new_classes = ["ChatRoom"]
EOF
```

## 2. Setting Up Persistent Connections

### Implement WebSocket Handler in Durable Object

Update the `ChatRoom.ts` file:

```typescript
async fetch(request: Request) {
  const url = new URL(request.url);
  
  if (url.pathname === "/websocket") {
    // Accept the WebSocket connection
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected websocket", { status: 400 });
    }
    
    const [client, server] = Object.values(new WebSocketPair());
    const userId = url.searchParams.get("userId") || crypto.randomUUID();
    
    await this.handleSession(server, userId);
    
    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }
  
  return new Response("Not found", { status: 404 });
}

async handleSession(webSocket: WebSocket, userId: string) {
  // Store the WebSocket connection
  this.sessions.set(userId, webSocket);
  
  // Set up event handlers
  webSocket.addEventListener("message", async (msg) => {
    try {
      const data = JSON.parse(msg.data as string);
      // Handle incoming messages
      // ...
      
      // Store message in Durable Object state
      this.messages.push({
        userId,
        content: data.content,
        timestamp: new Date().toISOString(),
      });
      
      // Broadcast to all connected clients
      this.broadcast({
        type: "message",
        userId,
        content: data.content,
        timestamp: new Date().toISOString(),
      });
      
      // Persist messages to storage
      await this.state.storage.put("messages", this.messages);
    } catch (err) {
      console.error("Error handling message", err);
    }
  });
  
  webSocket.addEventListener("close", () => {
    this.sessions.delete(userId);
    this.broadcast({
      type: "user-disconnected",
      userId,
      timestamp: new Date().toISOString(),
    });
  });
  
  // Send connection confirmation
  webSocket.send(JSON.stringify({
    type: "connected",
    userId,
    timestamp: new Date().toISOString(),
  }));
  
  // Send message history
  webSocket.send(JSON.stringify({
    type: "history",
    messages: this.messages.slice(-50), // Last 50 messages
    timestamp: new Date().toISOString(),
  }));
  
  // Announce new user
  this.broadcast({
    type: "user-connected",
    userId,
    timestamp: new Date().toISOString(),
  });
}

broadcast(message: any) {
  const serialized = JSON.stringify(message);
  for (const [userId, socket] of this.sessions.entries()) {
    try {
      socket.send(serialized);
    } catch (err) {
      // Handle failed send (connection might be dead)
      this.sessions.delete(userId);
    }
  }
}
```

### Implement Worker Router

Update your `src/index.ts` file:

```typescript
import { ChatRoom } from './ChatRoom';

export interface Env {
  CHAT_ROOM: DurableObjectNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Route requests to the appropriate Durable Object
    if (url.pathname.startsWith('/room/')) {
      const roomId = url.pathname.split('/')[2];
      const roomObjectId = env.CHAT_ROOM.idFromName(roomId);
      const roomObject = env.CHAT_ROOM.get(roomObjectId);
      
      return roomObject.fetch(request);
    }
    
    return new Response("Not found", { status: 404 });
  }
};
```

### Deploy the Worker

```bash
$ wrangler publish
✨ Successfully published your script to https://lol-realtime-worker.your-account.workers.dev
```

## 3. Real-time Notification System

### Create Notification Service in Next.js

Create a new file `src/services/notification.ts`:

```bash
$ mkdir -p src/services
$ touch src/services/notification.ts
```

Implement the notification service:

```typescript
// src/services/notification.ts
export interface Notification {
  id: string;
  type: 'friend-request' | 'post-time' | 'reaction' | 'mention';
  content: string;
  timestamp: string;
  read: boolean;
}

class NotificationService {
  private socket: WebSocket | null = null;
  private listeners: ((notification: Notification) => void)[] = [];
  
  connect(userId: string) {
    if (this.socket) {
      this.socket.close();
    }
    
    const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL;
    this.socket = new WebSocket(
      `${workerUrl?.replace('https://', 'wss://')}/room/notifications/websocket?userId=${userId}`
    );
    
    this.socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'notification') {
          this.notifyListeners(data.notification);
        }
      } catch (err) {
        console.error('Error parsing notification', err);
      }
    });
    
    this.socket.addEventListener('close', () => {
      // Attempt to reconnect after delay
      setTimeout(() => this.connect(userId), 5000);
    });
  }
  
  addListener(callback: (notification: Notification) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  private notifyListeners(notification: Notification) {
    this.listeners.forEach(listener => listener(notification));
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const notificationService = new NotificationService();
```

### Create a React Context for Notifications

```bash
$ touch src/contexts/NotificationContext.tsx
```

Implement the context:

```tsx
// src/contexts/NotificationContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { notificationService, Notification } from '@/services/notification';
import { useSession } from 'next-auth/react';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    if (session?.user?.id) {
      // Connect to notification service
      notificationService.connect(session.user.id);
      
      // Add listener for new notifications
      const removeListener = notificationService.addListener((notification) => {
        setNotifications(prev => [notification, ...prev]);
        
        // Show browser notification if supported
        if (Notification.permission === 'granted') {
          new Notification('lol app', {
            body: notification.content,
            icon: '/icon-192x192.png',
          });
        }
      });
      
      // Fetch existing notifications
      fetch('/api/notifications')
        .then(res => res.json())
        .then(data => {
          setNotifications(data.notifications);
        });
      
      return () => {
        removeListener();
        notificationService.disconnect();
      };
    }
  }, [session]);
  
  const markAsRead = async (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    
    await fetch(`/api/notifications/${id}/read`, {
      method: 'POST',
    });
  };
  
  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    
    await fetch('/api/notifications/read-all', {
      method: 'POST',
    });
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAsRead, 
      markAllAsRead 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
```

## 4. Friend Activity Streams

### Create Activity Stream Service

```bash
$ touch src/services/activityStream.ts
```

Implement the service:

```typescript
// src/services/activityStream.ts
export interface FriendActivity {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  type: 'post' | 'reaction' | 'comment' | 'online';
  content?: string;
  timestamp: string;
  postId?: string;
}

class ActivityStreamService {
  private socket: WebSocket | null = null;
  private listeners: ((activity: FriendActivity) => void)[] = [];
  
  connect(userId: string) {
    if (this.socket) {
      this.socket.close();
    }
    
    const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL;
    this.socket = new WebSocket(
      `${workerUrl?.replace('https://', 'wss://')}/room/activity/websocket?userId=${userId}`
    );
    
    this.socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'activity') {
          this.notifyListeners(data.activity);
        }
      } catch (err) {
        console.error('Error parsing activity', err);
      }
    });
    
    this.socket.addEventListener('close', () => {
      // Attempt to reconnect after delay
      setTimeout(() => this.connect(userId), 5000);
    });
  }
  
  addListener(callback: (activity: FriendActivity) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  private notifyListeners(activity: FriendActivity) {
    this.listeners.forEach(listener => listener(activity));
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const activityStreamService = new ActivityStreamService();
```

### Create Activity Stream Context

```bash
$ touch src/contexts/ActivityStreamContext.tsx
```

Implement the context:

```tsx
// src/contexts/ActivityStreamContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { activityStreamService, FriendActivity } from '@/services/activityStream';
import { useSession } from 'next-auth/react';

interface ActivityStreamContextType {
  activities: FriendActivity[];
  friendsOnline: string[];
}

const ActivityStreamContext = createContext<ActivityStreamContextType>({
  activities: [],
  friendsOnline: [],
});

export const ActivityStreamProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [activities, setActivities] = useState<FriendActivity[]>([]);
  const [friendsOnline, setFriendsOnline] = useState<string[]>([]);
  
  useEffect(() => {
    if (session?.user?.id) {
      // Connect to activity stream service
      activityStreamService.connect(session.user.id);
      
      // Add listener for new activities
      const removeListener = activityStreamService.addListener((activity) => {
        if (activity.type === 'online') {
          setFriendsOnline(prev => 
            prev.includes(activity.userId) ? prev : [...prev, activity.userId]
          );
        } else {
          setActivities(prev => [activity, ...prev].slice(0, 100)); // Keep last 100 activities
        }
      });
      
      // Fetch initial activities
      fetch('/api/friends/activities')
        .then(res => res.json())
        .then(data => {
          setActivities(data.activities);
          setFriendsOnline(data.onlineFriends);
        });
      
      return () => {
        removeListener();
        activityStreamService.disconnect();
      };
    }
  }, [session]);
  
[LLM API] Success! Response contains 1 choices
 POST /api/llm 200 in 50948ms
[2025-03-06T09:25:51.776Z] [INFO] [LLM:9onrreo5wyd] Response status: 200
[2025-03-06T09:25:51.776Z] [INFO] [LLM:9onrreo5wyd] Response length: 14133
[2025-03-06T09:25:51.776Z] [INFO] [LLM:9onrreo5wyd] LLM Response
[2025-03-06T09:25:51.776Z] [INFO] [LLM:9onrreo5wyd] Data: # Camera System Implementation Guide for lol

This command prompt guides developers through the implementation of the dual-camera capture system for lol, focusing on capturing, processing, and enhancing photos with emotion recognition.

## Prerequisites

- Node.js 18+ installed
- Next.js 14+ project set up
- TensorFlow.js understanding
- Access to the lol GitHub repository
- Camera-enabled device for testing

## 1. Set Up Project Environment

```bash
# Clone the repository
git clone https://github.com/lol-app/lol.git
cd lol

# Install dependencies
npm install

# Install camera-specific packages
npm install react-webcam @mediapipe/face_mesh @tensorflow/tfjs @tensorflow-models/face-landmarks-detection
```

## 2. Camera API Implementation

### Create Camera Component Structure

```bash
# Create camera component directory
mkdir -p src/components/camera
cd src/components/camera

# Create necessary files
touch DualCameraCapture.tsx CameraPermissions.tsx EmotionProcessor.tsx AIEnhancement.tsx CameraControls.tsx index.ts
```

### Implement Basic Camera Component

Add this to `DualCameraCapture.tsx`:

```tsx
import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { CameraPermissions } from './CameraPermissions';
import { CameraControls } from './CameraControls';

export const DualCameraCapture: React.FC = () => {
  const [frontCameraActive, setFrontCameraActive] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const frontCameraRef = useRef<Webcam>(null);
  const backCameraRef = useRef<Webcam>(null);
  
  // Camera constraints
  const frontCameraConstraints = {
    video: { facingMode: "user" }
  };
  
  const backCameraConstraints = {
    video: { facingMode: "environment" }
  };
  
  // Toggle between cameras
  const switchCamera = () => {
    setFrontCameraActive(prev => !prev);
  };
  
  // Capture images from both cameras
  const captureImages = async () => {
    if (!frontCameraRef.current || !backCameraRef.current) return;
    
    const frontImage = frontCameraRef.current.getScreenshot();
    const backImage = backCameraRef.current.getScreenshot();
    
    // TODO: Process and send images to emotion detection pipeline
    console.log("Captured front and back images");
    
    return { frontImage, backImage };
  };
  
  return (
    <div className="dual-camera-container">
      <CameraPermissions setHasPermission={setHasPermission} />
      
      {hasPermission === false && (
        <div className="permission-error">
          Camera access denied. Please enable camera permissions.
        </div>
      )}
      
      {hasPermission === true && (
        <>
          <div className="camera-views">
            <div className={`camera-view ${frontCameraActive ? 'active' : 'inactive'}`}>
              <Webcam
                ref={frontCameraRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={frontCameraConstraints}
                className="camera-feed"
              />
            </div>
            <div className={`camera-view ${!frontCameraActive ? 'active' : 'inactive'}`}>
              <Webcam
                ref={backCameraRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={backCameraConstraints}
                className="camera-feed"
              />
            </div>
          </div>
          
          <CameraControls 
            onSwitchCamera={switchCamera} 
            onCapture={captureImages}
            frontCameraActive={frontCameraActive}
          />
        </>
      )}
    </div>
  );
};
```

## 3. Handle Camera Permissions 

Implement `CameraPermissions.tsx`:

```bash
cat > CameraPermissions.tsx << 'EOF'
import React, { useEffect } from 'react';

interface CameraPermissionsProps {
  setHasPermission: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export const CameraPermissions: React.FC<CameraPermissionsProps> = ({ 
  setHasPermission 
}) => {
  useEffect(() => {
    async function requestPermissions() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        // Clean up stream tracks
        stream.getTracks().forEach(track => track.stop());
        
        setHasPermission(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setHasPermission(false);
      }
    }
    
    requestPermissions();
  }, [setHasPermission]);
  
  return null;
};
EOF
```

## 4. Implement Camera Controls

Add controls to `CameraControls.tsx`:

```bash
cat > CameraControls.tsx << 'EOF'
import React from 'react';
import { motion } from 'framer-motion';

interface CameraControlsProps {
  onSwitchCamera: () => void;
  onCapture: () => Promise<any>;
  frontCameraActive: boolean;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  onSwitchCamera,
  onCapture,
  frontCameraActive
}) => {
  return (
    <div className="camera-controls">
      <motion.button 
        className="switch-camera-btn"
        onClick={onSwitchCamera}
        whileTap={{ scale: 0.95 }}
      >
        {frontCameraActive ? 'Switch to Back Camera' : 'Switch to Front Camera'}
      </motion.button>
      
      <motion.button 
        className="capture-btn"
        onClick={onCapture}
        whileTap={{ scale: 0.95 }}
      >
        Capture Moment
      </motion.button>
    </div>
  );
};
EOF
```

## 5. Set Up TensorFlow.js for Emotion Detection

Create the emotion processor component:

```bash
cat > EmotionProcessor.tsx << 'EOF'
import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

// Emotion types
export type Emotion = 'happy' | 'sad' | 'angry' | 'surprised' | 'neutral';

interface EmotionProcessorProps {
  imageData: string | null;
  onEmotionDetected: (emotion: Emotion) => void;
}

export const EmotionProcessor: React.FC<EmotionProcessorProps> = ({
  imageData,
  onEmotionDetected
}) => {
  const [model, setModel] = useState<faceLandmarksDetection.FaceLandmarksDetector | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Load TensorFlow model
  useEffect(() => {
    async function loadModel() {
      try {
        // Load TensorFlow.js
        await tf.ready();
        
        // Load face landmarks model
        const model = await faceLandmarksDetection.load(
          faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
          { maxFaces: 1 }
        );
        
        setModel(model);
        console.log("Face landmarks model loaded successfully");
      } catch (error) {
        console.error("Error loading face detection model:", error);
      }
    }
    
    loadModel();
    
    // Cleanup
    return () => {
      // Dispose of any tensors if needed
    };
  }, []);
  
  // Process image when available
  useEffect(() => {
    async function processImage() {
      if (!imageData || !model || isProcessing) return;
      
      setIsProcessing(true);
      
      try {
        const img = new Image();
        img.src = imageData;
        
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        
        // Get face landmarks
        const predictions = await model.estimateFaces({
          input: img
        });
        
        if (predictions.length > 0) {
          // Extract facial features
          const landmarks = predictions[0].landmarks;
          
          // Simple emotion detection algorithm (placeholder)
          // In a real implementation, you would use a more sophisticated model
          const emotion = detectEmotion(landmarks);
          onEmotionDetected(emotion);
        } else {
          console.log("No faces detected");
          onEmotionDetected('neutral');
        }
      } catch (error) {
        console.error("Error processing image:", error);
        onEmotionDetected('neutral');
      } finally {
        setIsProcessing(false);
      }
    }
    
    processImage();
  }, [imageData, model, isProcessing, onEmotionDetected]);
  
  // Placeholder function - would be replaced with actual emotion detection
  const detectEmotion = (landmarks: any): Emotion => {
    // This is a simplified placeholder
    // In production, use a proper emotion classification model
    return 'happy';
  };
  
  return null; // This is a non-visual component
};
EOF
```

## 6. Implement AI Enhancement Pipeline

Create the AI enhancement component:

```bash
cat > AIEnhancement.tsx << 'EOF'
import React, { useEffect, useState } from 'react';
import { Emotion } from './EmotionProcessor';

interface AIEnhancementProps {
  originalImage: string | null;
  emotion: Emotion | null;
  environmentContext?: string;
  onEnhancementComplete: (enhancedImage: string) => void;
}

export const AIEnhancement: React.FC<AIEnhancementProps> = ({
  originalImage,
  emotion,
  environmentContext,
  onEnhancementComplete
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  useEffect(() => {
    if (!originalImage || !emotion || isEnhancing) return;
    
    async function enhanceImage() {
      setIsEnhancing(true);
      
      try {
        // In production, this would call your AI enhancement service
        // For now, we'll simulate the enhancement with a timeout
        console.log(`Enhancing image based on emotion: ${emotion}`);
        
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Apply visual effects based on emotion
        const enhancedImage = await applyEmotionEffects(originalImage, emotion, environmentContext);
        
        onEnhancementComplete(enhancedImage);
      } catch (error) {
        console.error("Error enhancing image:", error);
        // Fallback to original image
        onEnhancementComplete(originalImage);
      } finally {
        setIsEnhancing(false);
      }
    }
    
    enhanceImage();
  }, [originalImage, emotion, environmentContext, isEnhancing, onEnhancementComplete]);
  
  // Placeholder function for applying visual effects
  const applyEmotionEffects = async (
    image: string, 
    emotion: Emotion, 
    context?: string
  ): Promise<string> => {
    // In production, this would use canvas or WebGL to apply effects
    // or call a server-side AI service
    
    // For now, just return the original image
    return image;
  };
  
  return (
    <>
      {isEnhancing && (
        <div className="enhancement-loading">
          Enhancing your moment with AI magic...
        </div>
      )}
    </>
  );
};
EOF
```

## 7. Export Camera Components

Create an index file to export all components:

```bash
cat > index.ts << 'EOF'
export * from './DualCameraCapture';
export * from './CameraPermissions';
export * from './CameraControls';
export * from './EmotionProcessor';
export * from './AIEnhancement';
EOF
```

## 8. Integrate Camera System with Next.js Page

Create a camera page:

```bash
# Navigate to pages directory
cd ../../../pages

# Create camera page
cat > camera.tsx << 'EOF'
import React, { useState } from 'react';
import { NextPage } from 'next';
import { DualCameraCapture, EmotionProcessor, AIEnhancement } from '../components/camera';
import { Emotion } from '../components/camera/EmotionProcessor';

const CameraPage: NextPage = () => {
  const [capturedImages, setCapturedImages] = useState<{
    frontImage: string | null;
    backImage: string | null;
  }>({
    frontImage: null,
    backImage: null
  });
  
  const [detectedEmotion, setDetectedEmotion] = useState<Emotion | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  
  const handleCapture = (images: { frontImage: string; backImage: string }) => {
    setCapturedImages(images);
  };
  
  const handleEmotionDetected = (emotion: Emotion) => {
    setDetectedEmotion(emotion);
    console.log(`Detected emotion: ${emotion}`);
  };
  
  const handleEnhancementComplete = (enhancedImage: string) => {
    setEnhancedImage(enhancedImage);
  };
  
  const toggleView = () => {
    setShowOriginal(prev => !prev);
  };
  
  return (
    <div className="camera-page">
      <h1>lol Camera</h1>
      
      {!capturedImages.frontImage && (
        <DualCameraCapture onCapture={handleCapture} />
      )}
      
      {capturedImages.frontImage && !enhancedImage && (
        <>
          <div className="processing-state">
            <p>Processing your authentic moment...</p>
          </div>
          
          <EmotionProcessor 
            imageData={capturedImages.frontImage} 
            onEmotionDetected={handleEmotionDetected}
          />
          
          {detectedEmotion && (
            <AIEnhancement
              originalImage={capturedImages.frontImage}
              emotion={detectedEmotion}
              environmentContext="indoors" // This would be detected in production
              onEnhancementComplete={handleEnhancementComplete}
            />
          )}
        </>
      )}
      
      {enhancedImage && (
        <div className="result-view">
          <div className="image-container">
            <img 
              src={showOriginal ? capturedImages.frontImage! : enhancedImage} 
              alt="Captured moment" 
              className="result-image"
            />
            <div className="emotion-indicator">
              {detectedEmotion && `Detected mood: ${detectedEmotion}`}
            </div>
          </div>
          
          <div className="view-controls">
            <button onClick={toggleView} className="toggle-view-btn">
              {showOriginal ? 'Show Enhanced (Feel Real)' : 'Show Original (Pure Real)'}
            </button>
            
            <button 
              onClick={() => {
                setCapturedImages({ frontImage: null, backImage: null });
                setDetectedEmotion(null);
                setEnhance
[LLM API] Success! Response contains 1 choices
 POST /api/llm 200 in 52461ms
[2025-03-06T09:25:53.289Z] [INFO] [LLM:na6x8harqqh] Response status: 200
[2025-03-06T09:25:53.289Z] [INFO] [LLM:na6x8harqqh] Response length: 13807
[2025-03-06T09:25:53.289Z] [INFO] [LLM:na6x8harqqh] LLM Response
[2025-03-06T09:25:53.289Z] [INFO] [LLM:na6x8harqqh] Data: # Mastra Workflow Engine Implementation Guide for lol

This guide provides a comprehensive walkthrough for implementing the Mastra workflow engine to orchestrate AI analysis tasks within the lol social app. Follow these steps to set up emotion recognition pipelines, memory journal generation, and friend insights workflows.

## Prerequisites

- Node.js 18+ installed
- Next.js project initialized
- Basic understanding of TypeScript
- Installed project dependencies

## 1. Setting Up Mastra Workflow Engine

### Install Mastra Package

```bash
# Install the Mastra workflow engine
npm install mastra

# Install supporting libraries
npm install openai @upstash/redis neon zod
```

### Initialize Configuration

Create a configuration file at `src/lib/workflow/config.ts`:

```typescript
// src/lib/workflow/config.ts
import { MastraConfig } from 'mastra';

export const mastraConfig: MastraConfig = {
  storage: {
    type: 'redis',
    config: {
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    }
  },
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
  maxRetries: 3,
  retryDelayMs: 1000,
};
```

### Create Workflow Engine Instance

```typescript
// src/lib/workflow/engine.ts
import { WorkflowEngine } from 'mastra';
import { mastraConfig } from './config';

export const workflowEngine = new WorkflowEngine(mastraConfig);

// Initialize and register all workflows
export async function initializeWorkflows() {
  await workflowEngine.initialize();
  
  // Register workflows (we'll define these later)
  workflowEngine.registerWorkflow('emotionRecognition', emotionRecognitionWorkflow);
  workflowEngine.registerWorkflow('memoryJournal', memoryJournalWorkflow);
  workflowEngine.registerWorkflow('friendInsights', friendInsightsWorkflow);
  
  console.log('✅ Mastra workflows initialized');
}
```

## 2. Defining AI Analysis Workflows

### Create Workflow Types

```typescript
// src/lib/workflow/types.ts
import { z } from 'zod';

// Input/output schemas for emotion recognition
export const EmotionRecognitionInput = z.object({
  userId: z.string(),
  frontImageUrl: z.string().url(),
  backImageUrl: z.string().url(),
  timestamp: z.number(),
  location: z.object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }).optional(),
});

export const EmotionRecognitionOutput = z.object({
  primaryEmotion: z.enum(['joy', 'sadness', 'surprise', 'anger', 'fear', 'disgust', 'neutral']),
  emotionConfidence: z.number(),
  secondaryEmotions: z.array(z.string()),
  environmentalContext: z.string(),
  suggestedEnhancements: z.array(z.object({
    type: z.string(),
    intensity: z.number(),
    description: z.string(),
  })),
  rawAnalysisData: z.record(z.any()),
});

// Add similar schemas for Memory Journal and Friend Insights
// ...

export type EmotionRecognitionInputType = z.infer<typeof EmotionRecognitionInput>;
export type EmotionRecognitionOutputType = z.infer<typeof EmotionRecognitionOutput>;
```

## 3. Emotion Recognition Pipeline

### Define the Workflow

```typescript
// src/lib/workflow/emotionRecognition.ts
import { Workflow } from 'mastra';
import { EmotionRecognitionInputType, EmotionRecognitionOutputType } from './types';
import { analyzeImage, detectEnvironment, generateEnhancements } from '../ai/emotionAI';

export const emotionRecognitionWorkflow: Workflow<
  EmotionRecognitionInputType,
  EmotionRecognitionOutputType
> = {
  name: 'emotionRecognition',
  description: 'Analyzes user images to detect emotions and environmental context',
  
  async execute(input, context) {
    context.logger.info('Starting emotion recognition', { userId: input.userId });
    
    // Step 1: Analyze facial expressions in the front camera image
    const facialAnalysis = await context.step('analyzeFace', async () => {
      return await analyzeImage(input.frontImageUrl);
    });
    
    // Step 2: Detect environmental context from back camera
    const environmentalContext = await context.step('analyzeEnvironment', async () => {
      return await detectEnvironment(input.backImageUrl);
    });
    
    // Step 3: Generate enhancement suggestions based on emotion and environment
    const enhancements = await context.step('generateEnhancements', async () => {
      return await generateEnhancements(facialAnalysis, environmentalContext);
    });
    
    // Return the complete analysis
    return {
      primaryEmotion: facialAnalysis.primaryEmotion,
      emotionConfidence: facialAnalysis.confidence,
      secondaryEmotions: facialAnalysis.secondaryEmotions,
      environmentalContext: environmentalContext.description,
      suggestedEnhancements: enhancements,
      rawAnalysisData: {
        facial: facialAnalysis.raw,
        environmental: environmentalContext.raw
      }
    };
  }
};
```

### Implement AI Services

```typescript
// src/lib/ai/emotionAI.ts
import { OpenAI } from 'openai';
import TensorFlow from '@tensorflow/tfjs-node';
import { loadFaceApiModel } from '../utils/faceApiLoader';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeImage(imageUrl: string) {
  // Load face detection model
  const faceDetectionModel = await loadFaceApiModel();
  
  // Perform initial on-server analysis
  const imageBuffer = await fetch(imageUrl).then(r => r.arrayBuffer());
  const tensor = TensorFlow.node.decodeImage(
    new Uint8Array(imageBuffer),
    3
  );
  
  const detections = await faceDetectionModel.detectAllFaces(tensor)
    .withFaceExpressions()
    .withFaceDescriptors();
    
  // Process raw results into structured data
  const primaryEmotion = determinePrimaryEmotion(detections);
  
  // For more nuanced analysis, use OpenAI
  const openaiAnalysis = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Analyze this facial expression and identify the emotional state. Provide primary emotion, confidence level (0-1), and possible secondary emotions." },
          { type: "image_url", image_url: { url: imageUrl } }
        ]
      }
    ],
    max_tokens: 300,
  });
  
  // Parse the OpenAI response
  const aiAnalysis = parseOpenAIEmotionResponse(openaiAnalysis.choices[0].message.content);
  
  return {
    primaryEmotion: aiAnalysis.primaryEmotion,
    confidence: aiAnalysis.confidence,
    secondaryEmotions: aiAnalysis.secondaryEmotions,
    raw: {
      tfjs: detections,
      openai: openaiAnalysis
    }
  };
}

export async function detectEnvironment(imageUrl: string) {
  // Similar implementation for environment detection
  // ...
}

export async function generateEnhancements(facialAnalysis, environmentalContext) {
  // Generate enhancement suggestions based on emotion and environment
  // ...
}

function determinePrimaryEmotion(detections) {
  // Logic to determine primary emotion from face-api.js detections
  // ...
}

function parseOpenAIEmotionResponse(content: string) {
  // Parse the OpenAI response into structured data
  // ...
}
```

## 4. Memory Journal Generation Workflow

```typescript
// src/lib/workflow/memoryJournal.ts
import { Workflow } from 'mastra';
import { prisma } from '../db';
import { analyzeUserPatterns, generateMemoryInsights } from '../ai/memoryAI';

export const memoryJournalWorkflow: Workflow = {
  name: 'memoryJournal',
  
  async execute(input, context) {
    const { userId, timeframe } = input;
    
    // Step 1: Retrieve user's posts for the specified timeframe
    const userPosts = await context.step('fetchUserPosts', async () => {
      return await prisma.post.findMany({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - timeframe)
          }
        },
        include: {
          emotionAnalysis: true,
          location: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      });
    });
    
    // Step 2: Analyze patterns in the user's posts
    const patterns = await context.step('analyzePatterns', async () => {
      return await analyzeUserPatterns(userPosts);
    });
    
    // Step 3: Generate memory journal insights
    const journalEntries = await context.step('generateInsights', async () => {
      return await generateMemoryInsights(userPosts, patterns);
    });
    
    // Step 4: Save the generated journal entries
    await context.step('saveJournal', async () => {
      await prisma.memoryJournal.create({
        data: {
          userId,
          entries: journalEntries,
          generatedAt: new Date(),
          timeframeStart: new Date(Date.now() - timeframe),
          timeframeEnd: new Date()
        }
      });
    });
    
    return {
      journalId: journalEntries.id,
      entryCount: journalEntries.length,
      patternsSummary: patterns.summary
    };
  }
};
```

## 5. Friend Insights Generation

```typescript
// src/lib/workflow/friendInsights.ts
import { Workflow } from 'mastra';
import { prisma } from '../db';
import { analyzeFriendshipDynamics, generatePersonalizedSuggestions } from '../ai/friendshipAI';

export const friendInsightsWorkflow: Workflow = {
  name: 'friendInsights',
  
  async execute(input, context) {
    const { userId, friendId } = input;
    
    // Step 1: Fetch interaction history between the two users
    const interactions = await context.step('fetchInteractions', async () => {
      return await prisma.interaction.findMany({
        where: {
          OR: [
            { fromUserId: userId, toUserId: friendId },
            { fromUserId: friendId, toUserId: userId }
          ]
        },
        orderBy: {
          timestamp: 'desc'
        },
        take: 50
      });
    });
    
    // Step 2: Fetch recent posts from both users
    const [userPosts, friendPosts] = await Promise.all([
      context.step('fetchUserPosts', () => 
        prisma.post.findMany({
          where: { userId },
          include: { emotionAnalysis: true },
          orderBy: { createdAt: 'desc' },
          take: 10
        })
      ),
      context.step('fetchFriendPosts', () => 
        prisma.post.findMany({
          where: { userId: friendId },
          include: { emotionAnalysis: true },
          orderBy: { createdAt: 'desc' },
          take: 10
        })
      )
    ]);
    
    // Step 3: Analyze friendship dynamics
    const dynamics = await context.step('analyzeDynamics', async () => {
      return await analyzeFriendshipDynamics(interactions, userPosts, friendPosts);
    });
    
    // Step 4: Generate personalized engagement suggestions
    const suggestions = await context.step('generateSuggestions', async () => {
      return await generatePersonalizedSuggestions(dynamics, friendPosts[0]);
    });
    
    // Step 5: Save the insights and suggestions
    await context.step('saveInsights', async () => {
      await prisma.friendInsight.create({
        data: {
          fromUserId: userId,
          toUserId: friendId,
          dynamics: dynamics,
          suggestions,
          generatedAt: new Date()
        }
      });
    });
    
    return {
      dynamics: dynamics.summary,
      suggestions
    };
  }
};
```

## 6. Error Handling and Retries

Enhance your workflow implementations with robust error handling:

```typescript
// src/lib/workflow/errorHandling.ts
import { Workflow, WorkflowError } from 'mastra';

// Wrap your workflows with error handling
export function withErrorHandling<I, O>(workflow: Workflow<I, O>): Workflow<I, O> {
  const originalExecute = workflow.execute;
  
  return {
    ...workflow,
    async execute(input, context) {
      try {
        return await originalExecute.call(this, input, context);
      } catch (error) {
        // Log the error
        context.logger.error('Workflow execution failed', { 
          workflowName: workflow.name, 
          error: error.message,
          input
        });
        
        // Custom handling for specific errors
        if (error.code === 'RATE_LIMITED') {
          // Add to retry queue with exponential backoff
          throw new WorkflowError('Rate limit exceeded', {
            retryAfter: 5000 * Math.pow(2, context.attempt),
            retryable: true
          });
        }
        
        // For AI model errors, try fallback model
        if (error.code === 'AI_MODEL_ERROR') {
          context.logger.info('Attempting fallback AI model');
          return await context.step('fallbackProcessing', async () => {
            // Implement fallback processing logic
            // ...
          });
        }
        
        // Re-throw other errors
        throw error;
      }
    }
  };
}

// Apply the error handling wrapper to your workflows
export const emotionRecognitionWithErrorHandling = withErrorHandling(emotionRecognitionWorkflow);
```

## 7. Monitoring Workflow Execution

### Create a Workflow Monitor

```typescript
// src/lib/workflow/monitoring.ts
import { workflowEngine } from './engine';

export async function setupWorkflowMonitoring() {
  // Subscribe to workflow events
  workflowEngine.on('workflowStarted', (event) => {
    console.log(`Workflow started: ${event.workflowName}`, {
      workflowId: event.workflowId,
      input: event.input
    });
  });
  
  workflowEngine.on('workflowCompleted', (event) => {
    console.log(`Workflow completed: ${event.workflowName}`, {
      workflowId: event.workflowId,
      executionTimeMs: event.executionTimeMs,
      output: event.output
    });
  });
  
  workflowEngine.on('workflowFailed', (event) => {
    console.error(`Workflow failed: ${event.workflowName}`, {
      workflowId: event.workflowId,
      error: event.error,
      attempts: event.attempts
    });
  });
  
  workflowEngine.on('stepCompl
[LLM API] Success! Response contains 1 choices
 POST /api/llm 200 in 52929ms
[2025-03-06T09:25:53.756Z] [INFO] [LLM:99z7ceei0le] Response status: 200
[2025-03-06T09:25:53.756Z] [INFO] [LLM:99z7ceei0le] Response length: 14120
[2025-03-06T09:25:53.756Z] [INFO] [LLM:99z7ceei0le] LLM Response
[2025-03-06T09:25:53.756Z] [INFO] [LLM:99z7ceei0le] Data: # AI Integration for lol: Workflow Guide

This command prompt guides developers through the process of integrating AI capabilities into the lol application, focusing on emotion recognition, content enhancement, and contextual analysis features.

## Prerequisites

- Node.js 18+ installed
- Next.js 14+ project initialized
- OpenRouter API key
- TensorFlow.js knowledge
- Access to project repositories

## 1. AI Architecture Setup

```bash
# Clone the AI services repository
git clone https://github.com/lol-app/ai-services.git
cd ai-services

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Open .env file to configure AI service endpoints
nano .env
```

Fill in the following environment variables:
```
OPENROUTER_API_KEY=your_api_key_here
EMOTION_MODEL_ENDPOINT=https://api.openrouter.ai/api/v1/models/anthropic/claude-3-haiku
CONTENT_ENHANCEMENT_ENDPOINT=https://api.openrouter.ai/api/v1/models/anthropic/claude-3-opus
MEMORY_JOURNAL_ENDPOINT=https://api.openrouter.ai/api/v1/models/anthropic/claude-3-sonnet
```

## 2. Client-Side Emotion Analysis Setup

```bash
# Navigate to the main project directory
cd ../lol-app

# Install TensorFlow.js and related packages
npm install @tensorflow/tfjs @tensorflow-models/face-landmarks-detection @tensorflow-models/face-detection

# Create the emotion detection module
mkdir -p src/lib/ai
touch src/lib/ai/emotionDetection.ts
```

Create the emotion detection implementation in `src/lib/ai/emotionDetection.ts`:

```typescript
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

export interface EmotionData {
  dominant: string;
  confidence: number;
  secondary?: string;
  secondaryConfidence?: number;
  facialFeatures: Record<string, number>;
}

export async function initEmotionDetection(): Promise<void> {
  // Load TensorFlow.js and required models
  await tf.ready();
  console.log('TensorFlow.js loaded successfully:', tf.version.tfjs);
  
  // Pre-load face detection model
  await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
  );
  console.log('Face landmarks detection model loaded');
}

export async function detectEmotion(imageElement: HTMLImageElement | HTMLVideoElement): Promise<EmotionData | null> {
  try {
    // Implementation of emotion detection logic
    const model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
    );
    
    const predictions = await model.estimateFaces({
      input: imageElement
    });
    
    if (predictions.length === 0) {
      console.log('No faces detected');
      return null;
    }
    
    // Extract facial landmarks and compute emotion
    const landmarks = predictions[0].scaledMesh;
    
    // Process landmarks to determine emotional state
    // This is a simplified example - actual implementation would be more complex
    const emotionResult = await processLandmarksForEmotion(landmarks);
    
    return emotionResult;
  } catch (error) {
    console.error('Error detecting emotion:', error);
    return null;
  }
}

async function processLandmarksForEmotion(landmarks: any[]): Promise<EmotionData> {
  // Simplified implementation
  // In a real application, this would use a more sophisticated algorithm
  
  // Mock response for demonstration
  return {
    dominant: 'happy',
    confidence: 0.82,
    secondary: 'surprised',
    secondaryConfidence: 0.12,
    facialFeatures: {
      eyeOpenness: 0.95,
      mouthCurvature: 0.78,
      browPosition: 0.45
    }
  };
}
```

## 3. Configure OpenRouter API Client

```bash
# Install OpenRouter SDK
npm install openrouter

# Create OpenRouter client configuration
touch src/lib/ai/openrouter.ts
```

Implement the OpenRouter client in `src/lib/ai/openrouter.ts`:

```typescript
import OpenRouter from 'openrouter';

// Initialize the OpenRouter client
const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

export interface EnhancementRequest {
  imageBase64: string;
  emotionData: any;
  enhancementType: 'subtle' | 'expressive' | 'artistic';
  userPreferences: Record<string, any>;
}

export interface EnhancementResponse {
  enhancedImageBase64: string;
  appliedEffects: string[];
  processingMetadata: Record<string, any>;
}

export async function generateEnhancement(
  request: EnhancementRequest
): Promise<EnhancementResponse> {
  try {
    const response = await openrouter.chat.completions.create({
      model: 'anthropic/claude-3-opus',
      messages: [
        {
          role: 'system',
          content: `You are an AI that enhances photos based on emotional context. 
          You will receive image data and emotion analysis, and should return 
          subtle enhancements that amplify the emotional quality without 
          changing the authenticity of the moment.`
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${request.imageBase64}` }
            },
            {
              type: 'text',
              text: JSON.stringify({
                emotionData: request.emotionData,
                enhancementType: request.enhancementType,
                userPreferences: request.userPreferences
              })
            }
          ]
        }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    // Process and return the enhanced image
    // This is a simplified implementation
    return {
      enhancedImageBase64: 'base64_encoded_image_data_here',
      appliedEffects: ['subtle_lighting', 'color_temperature_adjustment'],
      processingMetadata: {
        model: 'anthropic/claude-3-opus',
        processingTime: '1.2s'
      }
    };
  } catch (error) {
    console.error('Error generating enhancement:', error);
    throw new Error('Failed to generate image enhancement');
  }
}
```

## 4. Server-Side AI Integration with React Server Components

```bash
# Create server-side AI action handlers
mkdir -p src/app/api/ai
touch src/app/api/ai/enhance/route.ts
touch src/app/api/ai/memory-journal/route.ts
```

Implement the enhancement API route in `src/app/api/ai/enhance/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateEnhancement } from '@/lib/ai/openrouter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, emotionData, enhancementType, userPreferences } = body;
    
    if (!imageBase64 || !emotionData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const enhancementResult = await generateEnhancement({
      imageBase64,
      emotionData,
      enhancementType: enhancementType || 'subtle',
      userPreferences: userPreferences || {}
    });
    
    return NextResponse.json(enhancementResult);
  } catch (error) {
    console.error('Error in enhancement API:', error);
    return NextResponse.json(
      { error: 'Failed to process enhancement request' },
      { status: 500 }
    );
  }
}
```

## 5. Implement Emotion-Enhanced Capture Component

```bash
# Create the AI-enhanced camera component
mkdir -p src/components/camera
touch src/components/camera/EmotionEnhancedCapture.tsx
```

Implement the component in `src/components/camera/EmotionEnhancedCapture.tsx`:

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { detectEmotion, EmotionData, initEmotionDetection } from '@/lib/ai/emotionDetection';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader } from 'lucide-react';

export default function EmotionEnhancedCapture() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [emotionData, setEmotionData] = useState<EmotionData | null>(null);
  const [useEnhancement, setUseEnhancement] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize emotion detection
  useEffect(() => {
    async function loadModels() {
      try {
        await initEmotionDetection();
        setIsModelLoaded(true);
      } catch (error) {
        console.error('Failed to load emotion detection models:', error);
      }
    }
    
    loadModels();
  }, []);
  
  // Set up camera stream
  useEffect(() => {
    if (isCapturing && videoRef.current && !videoRef.current.srcObject) {
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error('Error accessing camera:', err);
        });
    }
    
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCapturing]);
  
  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageDataUrl);
    
    // Detect emotion
    setIsProcessing(true);
    const emotion = await detectEmotion(video);
    setEmotionData(emotion);
    
    // Process enhancement if enabled
    if (useEnhancement && emotion) {
      try {
        const imageBase64 = imageDataUrl.split(',')[1];
        
        const response = await fetch('/api/ai/enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64,
            emotionData: emotion,
            enhancementType: 'subtle',
            userPreferences: { preserveAuthenticity: true }
          })
        });
        
        if (!response.ok) throw new Error('Enhancement failed');
        
        const result = await response.json();
        setEnhancedImage(`data:image/jpeg;base64,${result.enhancedImageBase64}`);
      } catch (error) {
        console.error('Failed to enhance image:', error);
        // Fall back to original image
        setEnhancedImage(imageDataUrl);
      }
    } else {
      // Use original image if enhancement disabled
      setEnhancedImage(imageDataUrl);
    }
    
    setIsProcessing(false);
    setIsCapturing(false);
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      {!isModelLoaded ? (
        <div className="flex flex-col items-center p-8">
          <Loader className="animate-spin h-8 w-8 mb-2" />
          <p>Loading emotion detection models...</p>
        </div>
      ) : (
        <>
          {isCapturing ? (
            <div className="relative w-full max-w-md">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full rounded-lg"
              />
              <Button 
                onClick={captureImage}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                ) : 'Capture'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 w-full max-w-md">
              {enhancedImage ? (
                <div className="relative">
                  <img 
                    src={enhancedImage} 
                    alt="Enhanced capture" 
                    className="w-full rounded-lg" 
                  />
                  {emotionData && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-sm">
                      {emotionData.dominant} ({Math.round(emotionData.confidence * 100)}%)
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className="w-full aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center"
                  onClick={() => setIsCapturing(true)}
                >
                  <p className="text-gray-500">Tap to capture a moment</p>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={useEnhancement}
                    onCheckedChange={setUseEnhancement}
                    id="enhancement-mode"
                  />
                  <label htmlFor="enhancement-mode">
                    {useEnhancement ? 'Feel Real' : 'Pure Real'}
                  </label>
                </div>
                
                <Button
                  onClick={() => {
                    setCapturedImage(null);
                    setEnhancedImage(null);
                    setEmotionData(null);
                    setIsCapturing(true);
                  }}
                  variant="outline"
                >
                  New Capture
                </Button>
              </div>
            
[LLM API] Success! Response contains 1 choices
 POST /api/llm 200 in 53487ms
[2025-03-06T09:25:54.314Z] [INFO] [LLM:cb3sqlqadbv] Response status: 200
[2025-03-06T09:25:54.314Z] [INFO] [LLM:cb3sqlqadbv] Response length: 13924
[2025-03-06T09:25:54.314Z] [INFO] [LLM:cb3sqlqadbv] LLM Response
[2025-03-06T09:25:54.314Z] [INFO] [LLM:cb3sqlqadbv] Data: # Privacy and Security Implementation Guide for lol App

This guide provides step-by-step commands and workflows for implementing privacy and security features in the lol application. Follow these procedures to ensure compliance with privacy regulations and best practices when handling sensitive user data, including emotion data and facial recognition.

## Prerequisites

- Node.js (v18+) installed
- Next.js project set up
- Prisma CLI installed
- TypeScript configured
- Access to project repositories
- Required environment variables configured

## 1. Setting Up Data Privacy Architecture

### Initialize Privacy Configuration

```bash
# Create privacy configuration directory
mkdir -p src/config/privacy
touch src/config/privacy/index.ts

# Create the base privacy configuration file
cat > src/config/privacy/index.ts << EOL
export const PRIVACY_CONFIG = {
  dataRetentionPeriods: {
    emotionData: 30, // days
    facialRecognitionData: 7, // days
    rawImages: 3, // days
    enhancedImages: 30, // days
    userActivity: 90, // days
  },
  encryptionAlgorithms: {
    atRest: 'AES-256-GCM',
    inTransit: 'TLS-1.3',
    sensitiveData: 'ChaCha20-Poly1305',
  },
  anonymizationMethods: {
    userIdentifiers: 'SHA-256',
    locationData: 'geohashing-precision-reduction',
  }
};
EOL

echo "✅ Privacy configuration initialized"
```

### Set Up Prisma Schema with Privacy Considerations

```bash
# Update Prisma schema to include privacy-related fields
cat >> prisma/schema.prisma << EOL

model PrivacyConsent {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  emotionDataConsent Boolean  @default(false)
  locationDataConsent Boolean @default(false)
  aiEnhancementConsent Boolean @default(false)
  friendInsightsConsent Boolean @default(false)
  marketingConsent   Boolean  @default(false)
  lastUpdated       DateTime @default(now())
  ipAddress         String?
  consentVersion    String
}

model DataDeletionRequest {
  id                String   @id @default(cuid())
  userId            String
  requestType       String   // FULL, PARTIAL
  status            String   // PENDING, PROCESSING, COMPLETED, FAILED
  requestedAt       DateTime @default(now())
  completedAt       DateTime?
  dataCategories    String[] // Which categories to delete if PARTIAL
}
EOL

# Run migration
npx prisma migrate dev --name add_privacy_models

echo "✅ Prisma schema updated with privacy models"
```

## 2. Implementing User Consent Management

### Create Consent Management Components

```bash
# Create consent management components
mkdir -p src/components/privacy
touch src/components/privacy/ConsentManager.tsx
touch src/components/privacy/ConsentForm.tsx
touch src/components/privacy/PrivacySettings.tsx

echo "✅ Created privacy component files"
```

### Implement Consent Manager Logic

```bash
# Create consent hooks and utilities
mkdir -p src/hooks/privacy
touch src/hooks/privacy/useConsent.ts

cat > src/hooks/privacy/useConsent.ts << EOL
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

export type ConsentSettings = {
  emotionDataConsent: boolean;
  locationDataConsent: boolean;
  aiEnhancementConsent: boolean;
  friendInsightsConsent: boolean;
  marketingConsent: boolean;
};

export function useConsent() {
  const [hasCompletedConsent, setHasCompletedConsent] = useState<boolean>(false);
  
  const { data: consentSettings, isLoading } = useQuery({
    queryKey: ['userConsent'],
    queryFn: async () => {
      const res = await fetch('/api/privacy/consent');
      if (!res.ok) throw new Error('Failed to fetch consent settings');
      return res.json();
    },
  });
  
  const updateConsentMutation = useMutation({
    mutationFn: async (newSettings: ConsentSettings) => {
      const res = await fetch('/api/privacy/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      
      if (!res.ok) throw new Error('Failed to update consent settings');
      return res.json();
    },
    onSuccess: () => {
      setHasCompletedConsent(true);
    },
  });
  
  useEffect(() => {
    if (consentSettings) {
      // Check if user has completed the consent flow
      const hasConsented = Object.values(consentSettings).some(value => value !== null);
      setHasCompletedConsent(hasConsented);
    }
  }, [consentSettings]);
  
  return {
    consentSettings,
    isLoading,
    updateConsent: updateConsentMutation.mutate,
    isUpdating: updateConsentMutation.isPending,
    hasCompletedConsent,
  };
}
EOL

echo "✅ Implemented consent management hooks"
```

### Create API Routes for Consent Management

```bash
# Create API routes for consent management
mkdir -p src/app/api/privacy/consent
touch src/app/api/privacy/consent/route.ts

cat > src/app/api/privacy/consent/route.ts << EOL
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const consent = await prisma.privacyConsent.findUnique({
      where: { userId: session.user.id },
    });
    
    return NextResponse.json(consent || {});
  } catch (error) {
    console.error('Failed to fetch consent settings:', error);
    return NextResponse.json({ error: 'Failed to fetch consent settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { 
      emotionDataConsent,
      locationDataConsent,
      aiEnhancementConsent,
      friendInsightsConsent,
      marketingConsent 
    } = body;
    
    // Get client IP address
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Current consent version
    const consentVersion = '1.0';
    
    const consent = await prisma.privacyConsent.upsert({
      where: { userId: session.user.id },
      update: {
        emotionDataConsent,
        locationDataConsent,
        aiEnhancementConsent,
        friendInsightsConsent,
        marketingConsent,
        lastUpdated: new Date(),
        ipAddress,
        consentVersion,
      },
      create: {
        userId: session.user.id,
        emotionDataConsent,
        locationDataConsent,
        aiEnhancementConsent,
        friendInsightsConsent,
        marketingConsent,
        ipAddress,
        consentVersion,
      },
    });
    
    return NextResponse.json(consent);
  } catch (error) {
    console.error('Failed to update consent settings:', error);
    return NextResponse.json({ error: 'Failed to update consent settings' }, { status: 500 });
  }
}
EOL

echo "✅ Created API routes for consent management"
```

## 3. Emotion Data Handling Policies

### Create Emotion Data Processing Service

```bash
# Create emotion data processing service with privacy controls
mkdir -p src/services/emotion
touch src/services/emotion/processor.ts
touch src/services/emotion/anonymizer.ts

cat > src/services/emotion/processor.ts << EOL
import { anonymizeEmotionData } from './anonymizer';
import { PRIVACY_CONFIG } from '@/config/privacy';

export type EmotionData = {
  userId: string;
  timestamp: Date;
  primaryEmotion: string;
  emotionIntensity: number;
  facialFeatures?: Record<string, number>;
  rawImageReference?: string;
};

export async function processEmotionData(
  userId: string, 
  imageData: Buffer, 
  hasConsent: boolean
): Promise<EmotionData | null> {
  // Early return if no consent
  if (!hasConsent) {
    console.log('User has not provided emotion data consent, skipping processing');
    return null;
  }
  
  try {
    // Simulate emotion detection (would use actual AI model in production)
    const detectedEmotion = {
      userId,
      timestamp: new Date(),
      primaryEmotion: 'joy',
      emotionIntensity: 0.85,
      facialFeatures: {
        smileWidth: 0.75,
        eyeOpenness: 0.8,
        browPosition: 0.2,
      },
      rawImageReference: 'temp-reference-for-processing',
    };
    
    // Apply privacy measures based on consent
    const processedData = anonymizeEmotionData(detectedEmotion);
    
    // Schedule data for automatic deletion after retention period
    const retentionPeriod = PRIVACY_CONFIG.dataRetentionPeriods.emotionData;
    scheduleDataDeletion('emotionData', userId, processedData.timestamp, retentionPeriod);
    
    return processedData;
  } catch (error) {
    console.error('Error processing emotion data:', error);
    return null;
  }
}

function scheduleDataDeletion(
  dataType: string, 
  userId: string, 
  timestamp: Date, 
  retentionDays: number
) {
  // In production, this would create a scheduled job
  console.log(`Scheduled deletion of ${dataType} for user ${userId} after ${retentionDays} days`);
}
EOL

cat > src/services/emotion/anonymizer.ts << EOL
import { EmotionData } from './processor';
import { createHash } from 'crypto';

export function anonymizeEmotionData(data: EmotionData): EmotionData {
  // Create a copy to avoid mutating the original
  const anonymized = { ...data };
  
  // Remove detailed facial features after emotion is extracted
  delete anonymized.facialFeatures;
  
  // Replace raw image reference with anonymized reference
  if (anonymized.rawImageReference) {
    anonymized.rawImageReference = createAnonymizedReference(
      data.userId,
      data.timestamp.toISOString()
    );
  }
  
  return anonymized;
}

function createAnonymizedReference(userId: string, timestamp: string): string {
  // Create hash from user ID and timestamp
  return createHash('sha256')
    .update(`${userId}:${timestamp}`)
    .digest('hex');
}
EOL

echo "✅ Created emotion data processing service with privacy controls"
```

### Implement Emotion Data Access Controls

```bash
# Create middleware for enforcing emotion data access controls
mkdir -p src/middleware
touch src/middleware/emotionDataAccess.ts

cat > src/middleware/emotionDataAccess.ts << EOL
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

export async function emotionDataAccessMiddleware(request: NextRequest) {
  // Check if the route involves emotion data
  if (request.nextUrl.pathname.startsWith('/api/emotion')) {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    try {
      // Check if user has consented to emotion data processing
      const consent = await prisma.privacyConsent.findUnique({
        where: { userId: token.sub as string },
        select: { emotionDataConsent: true },
      });
      
      if (!consent || !consent.emotionDataConsent) {
        return NextResponse.json(
          { error: 'Emotion data processing consent not provided' }, 
          { status: 403 }
        );
      }
      
      // Add consent information to request headers for downstream use
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-has-emotion-consent', 'true');
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error('Error checking emotion data consent:', error);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }
  
  return NextResponse.next();
}
EOL

echo "✅ Created middleware for emotion data access control"
```

## 4. Image Processing Privacy Safeguards

### Create Secure Image Processing Pipeline

```bash
# Create secure image processing components
mkdir -p src/services/images
touch src/services/images/secureProcessor.ts
touch src/services/images/metadataStripper.ts

cat > src/services/images/metadataStripper.ts << EOL
import { Buffer } from 'buffer';
import { PRIVACY_CONFIG } from '@/config/privacy';

export async function stripImageMetadata(imageBuffer: Buffer): Promise<Buffer> {
  try {
    // In a real implementation, this would use a library like sharp
    // to remove EXIF and other metadata
    console.log('Stripping metadata from image');
    
    // Simulate metadata stripping
    // In reality, you'd use:
    // const strippedImage = await sharp(imageBuffer)
    //   .withMetadata({ exif: { IFD0: { Make: '', Model: '' } } })
    //   .toBuffer();
    
    // For now, just return the original buffer
    return imageBuffer;
  } catch (error) {
    console.error('Error stripping image metadata:', error);
    return imageBuffer; // Return original as fallback
  }
}

export function sanitizeFilename(filename: string): string {
  // Remove potentially sensitive information from filename
  // Replace with a random string + original extension
  const extension = filename.split('.').pop() || 'jpg';
  const randomId = Math.random().toString(36).substring(2, 15);
  
  return `${randomId}.${extension}`;
}
EOL

cat > src/services/images/secureProcessor.ts << EOL
import { Buffer } from 'buffer';
import { stripImageMetadata, sanitizeFilename } from './metadataStripper';
import { PRIVACY_CONFIG } from '@/config/privacy';
import { createHash } from 'crypto';

type ImageProcessingOptions = {
  userId: string;
  preserveOriginal: boolean;
  applyAiEnhancement: boolean;
  sensitiveContent: boolean;
};

export async function processImageSecurely(
  imageBuffer: Buffer,
  filename: string,
  options: Image
[LLM API] Success! Response contains 1 choices
 POST /api/llm 200 in 56519ms
[2025-03-06T09:25:57.443Z] [INFO] [LLM:6lk1m6jv1st] Response status: 200
[2025-03-06T09:25:57.444Z] [INFO] [LLM:6lk1m6jv1st] Response length: 13966
[2025-03-06T09:25:57.444Z] [INFO] [LLM:6lk1m6jv1st] LLM Response
[2025-03-06T09:25:57.444Z] [INFO] [LLM:6lk1m6jv1st] Data: # Prompt Engineering for lol App

This guide provides a comprehensive workflow for implementing and managing AI prompts within the lol application. It focuses on standardized approaches to prompt design and management using Priompt's JSX-based architecture, ensuring consistent, personalized, and emotion-aware interactions throughout the application.

## Prerequisites

- Node.js 18+ and npm/yarn installed
- lol project repository cloned locally
- Basic understanding of React and JSX
- Priompt library installed: `npm install priompt`
- OpenRouter API key configured in your environment variables

## 1. Setting Up Priompt in Next.js

```bash
# Install Priompt and related dependencies
npm install priompt @anysphere/priompt-react zod

# Create prompt directory structure
mkdir -p src/lib/prompts/{templates,contexts,utils}
touch src/lib/prompts/index.ts
```

## 2. Creating Basic Prompt Templates

Create your first prompt template in `src/lib/prompts/templates/emotion-capture.tsx`:

```tsx
import { PromptTemplate } from 'priompt';

export const EmotionCapturePrompt = () => (
  <PromptTemplate>
    <system>
      You are an emotion analysis assistant for the lol app. Your role is to:
      1. Identify the primary emotion in the user's facial expression
      2. Suggest subtle visual enhancements that amplify this emotion
      3. Preserve authenticity while enhancing expressiveness
      
      Output format should be JSON with fields: 
      - primaryEmotion (string)
      - confidence (number between 0-1)
      - suggestedEnhancements (array of strings)
      - moodDescription (string, max 10 words)
    </system>
    
    <user>
      {/* This will be replaced with dynamic content */}
      The user has captured an image with the following facial analysis data:
      {props.facialData}
      
      Environmental context:
      {props.environmentContext}
      
      Time of day: {props.timeOfDay}
      Location type: {props.locationType}
    </user>
  </PromptTemplate>
);
```

## 3. Integrating Prompt Templates with React Components

Create a component that uses the prompt template in `src/components/EmotionEnhancer.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { usePrompt } from '@anysphere/priompt-react';
import { EmotionCapturePrompt } from '@/lib/prompts/templates/emotion-capture';
import { openRouter } from '@/lib/api/openRouter';

export function EmotionEnhancer({ facialData, environmentContext, timeOfDay, locationType }) {
  const [enhancements, setEnhancements] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Generate the prompt using the template
  const prompt = usePrompt(
    <EmotionCapturePrompt 
      facialData={facialData}
      environmentContext={environmentContext}
      timeOfDay={timeOfDay}
      locationType={locationType}
    />
  );
  
  async function analyzeEmotion() {
    setLoading(true);
    try {
      const response = await openRouter.generateCompletion({
        model: "anthropic/claude-3-opus",
        prompt: prompt.toString(),
        max_tokens: 500,
        temperature: 0.2,
      });
      
      const result = JSON.parse(response.text);
      setEnhancements(result);
    } catch (err) {
      setError(err.message);
      console.error("Error analyzing emotion:", err);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="emotion-enhancer">
      <button 
        onClick={analyzeEmotion} 
        disabled={loading}
        className="px-4 py-2 bg-primary rounded-md"
      >
        {loading ? "Analyzing..." : "Enhance with AI"}
      </button>
      
      {error && <div className="text-red-500 mt-2">{error}</div>}
      
      {enhancements && (
        <div className="mt-4">
          <div className="text-lg font-medium">Mood: {enhancements.moodDescription}</div>
          <div className="text-sm text-gray-500">Primary emotion: {enhancements.primaryEmotion} ({Math.round(enhancements.confidence * 100)}% confidence)</div>
          <div className="mt-2">
            <h4>Suggested enhancements:</h4>
            <ul className="list-disc pl-5">
              {enhancements.suggestedEnhancements.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
```

## 4. Creating a Prompt Context Provider

Set up a context provider for managing prompt state across components:

```bash
touch src/lib/prompts/contexts/PromptContext.tsx
```

Add the following to the file:

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

type UserContext = {
  username: string;
  friendIds: string[];
  recentMoods: string[];
  communicationStyle: string;
  preferredTopics: string[];
};

type PromptContextType = {
  userContext: UserContext;
  updateUserContext: (updates: Partial<UserContext>) => void;
  promptHistory: Array<{prompt: string, response: string, timestamp: Date}>;
  addToHistory: (prompt: string, response: string) => void;
};

const defaultUserContext: UserContext = {
  username: '',
  friendIds: [],
  recentMoods: [],
  communicationStyle: 'casual',
  preferredTopics: [],
};

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export function PromptProvider({ children }: { children: ReactNode }) {
  const [userContext, setUserContext] = useState<UserContext>(defaultUserContext);
  const [promptHistory, setPromptHistory] = useState<Array<{prompt: string, response: string, timestamp: Date}>>([]);
  
  const updateUserContext = (updates: Partial<UserContext>) => {
    setUserContext(prev => ({
      ...prev,
      ...updates
    }));
  };
  
  const addToHistory = (prompt: string, response: string) => {
    setPromptHistory(prev => [
      ...prev,
      { prompt, response, timestamp: new Date() }
    ].slice(-50)); // Keep only last 50 interactions
  };
  
  return (
    <PromptContext.Provider value={{
      userContext,
      updateUserContext,
      promptHistory,
      addToHistory
    }}>
      {children}
    </PromptContext.Provider>
  );
}

export function usePromptContext() {
  const context = useContext(PromptContext);
  if (context === undefined) {
    throw new Error('usePromptContext must be used within a PromptProvider');
  }
  return context;
}
```

## 5. Creating Emotion-Aware Prompt Utilities

```bash
touch src/lib/prompts/utils/emotionUtils.ts
```

Add utility functions for emotion-based prompt enhancement:

```typescript
// Emotion intensity mapping for different models
const EMOTION_INTENSITY_MAP = {
  joy: {
    low: "slightly happy",
    medium: "happy",
    high: "ecstatic"
  },
  sadness: {
    low: "a bit down",
    medium: "sad",
    high: "deeply saddened"
  },
  anger: {
    low: "annoyed",
    medium: "angry",
    high: "furious"
  },
  surprise: {
    low: "intrigued",
    medium: "surprised",
    high: "shocked"
  },
  fear: {
    low: "uneasy",
    medium: "anxious",
    high: "terrified"
  },
  disgust: {
    low: "displeased",
    medium: "disgusted",
    high: "revolted"
  },
  neutral: {
    low: "calm",
    medium: "neutral",
    high: "composed"
  }
};

// Map confidence scores to intensity levels
export function getEmotionIntensity(confidence: number): 'low' | 'medium' | 'high' {
  if (confidence < 0.4) return 'low';
  if (confidence < 0.7) return 'medium';
  return 'high';
}

// Get descriptive text for an emotion based on its intensity
export function getEmotionDescriptor(emotion: keyof typeof EMOTION_INTENSITY_MAP, confidence: number): string {
  const intensity = getEmotionIntensity(confidence);
  return EMOTION_INTENSITY_MAP[emotion][intensity];
}

// Generate contextual prompt modifiers based on emotion
export function generateEmotionPromptModifier(
  emotion: keyof typeof EMOTION_INTENSITY_MAP,
  confidence: number
): string {
  const descriptor = getEmotionDescriptor(emotion, confidence);
  
  switch(emotion) {
    case 'joy':
      return `The user appears ${descriptor}. Maintain an uplifting, celebratory tone while staying genuine.`;
    case 'sadness':
      return `The user appears ${descriptor}. Be supportive and empathetic without being overly cheerful.`;
    case 'anger':
      return `The user appears ${descriptor}. Keep responses calm and validating without being dismissive.`;
    case 'surprise':
      return `The user appears ${descriptor}. Acknowledge their reaction and provide thoughtful context.`;
    case 'fear':
      return `The user appears ${descriptor}. Offer reassuring but honest perspectives.`;
    case 'disgust':
      return `The user appears ${descriptor}. Acknowledge their reaction without judgment.`;
    case 'neutral':
      return `The user appears ${descriptor}. Match their balanced tone while adding subtle emotional warmth.`;
    default:
      return `Respond in a balanced, authentic manner.`;
  }
}

// Map environmental contexts to emotional significance
export function contextToEmotionalSignificance(context: string): string {
  const contexts = {
    "home": "a place of comfort and familiarity",
    "work": "a place associated with productivity and responsibility",
    "outdoors": "a setting connected to freedom and natural elements",
    "social": "an environment of connection and interaction",
    "transit": "a transitional space suggesting movement or change",
    "unfamiliar": "a place that may evoke curiosity or slight unease"
  };
  
  for (const [key, value] of Object.entries(contexts)) {
    if (context.toLowerCase().includes(key)) {
      return value;
    }
  }
  
  return "the current environment";
}
```

## 6. Creating Personalized Friend Interaction Prompts

```bash
touch src/lib/prompts/templates/friend-insight.tsx
```

Add a template for generating personalized friend interactions:

```tsx
import { PromptTemplate } from 'priompt';

export const FriendInsightPrompt = () => (
  <PromptTemplate>
    <system>
      You are a friendship insight assistant for the lol app. Your role is to suggest meaningful ways for users to engage with their friends based on:
      
      1. The friend's recent posts and emotional patterns
      2. The user's relationship history with this friend
      3. Shared experiences and interests
      
      Your suggestions should be:
      - Specific and actionable (not generic)
      - Emotionally intelligent
      - Authentic to the user's communication style
      - Respectful of both parties' emotional states
      
      Output format should be JSON with fields:
      - insightType: "check_in" | "reminisce" | "plan" | "appreciate" | "support"
      - suggestionText: string (1-2 sentences in the user's communication style)
      - rationale: string (why this suggestion makes sense now)
      - expectedReception: number (1-10 scale predicting how well this will be received)
    </system>
    
    <user>
      Friend's information:
      Name: {props.friendName}
      Recent emotional patterns: {props.friendRecentMoods}
      Recent posts contexts: {props.friendRecentContexts}
      Last interaction: {props.lastInteractionDate}
      
      User's information:
      Communication style: {props.userCommunicationStyle}
      Current mood: {props.userCurrentMood}
      Relationship history highlights: {props.relationshipHighlights}
      
      Shared interests: {props.sharedInterests}
    </user>
  </PromptTemplate>
);
```

## 7. Creating a Prompt Version Management System

```bash
mkdir -p src/lib/prompts/versions
touch src/lib/prompts/versions/versionManager.ts
```

Add version management functionality:

```typescript
import fs from 'fs';
import path from 'path';

// Interface for prompt version metadata
interface PromptVersionMeta {
  version: string;
  created: string;
  author: string;
  description: string;
  performanceMetrics?: {
    accuracy?: number;
    userSatisfaction?: number;
    processingTime?: number;
  };
}

// Store versions in memory during runtime
const promptVersions: Record<string, Record<string, PromptVersionMeta>> = {};

// Path to versions directory (only used in development)
const VERSIONS_DIR = path.join(process.cwd(), 'src/lib/prompts/versions');

// Save a new prompt version
export async function savePromptVersion(
  promptType: string,
  version: string,
  promptTemplate: string,
  metadata: Omit<PromptVersionMeta, 'version' | 'created'>
): Promise<void> {
  // Create metadata
  const versionMeta: PromptVersionMeta = {
    version,
    created: new Date().toISOString(),
    ...metadata
  };
  
  // Store in memory
  if (!promptVersions[promptType]) {
    promptVersions[promptType] = {};
  }
  promptVersions[promptType][version] = versionMeta;
  
  // In development, also save to file system
  if (process.env.NODE_ENV === 'development') {
    const typeDir = path.join(VERSIONS_DIR, promptType);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }
    
    // Save template and metadata
    fs.writeFileSync(
      path.join(typeDir, `${version}.prompt.txt`),
      promptTemplate
    );
    
    fs.writeFileSync(
      path.join(typeDir, `${version}.meta.json`),
      JSON.stringify(versionMeta, null, 2)
    );
  }
}

// Get a specific prompt version
export function getPromptVersion(promptType: string, version: string): PromptVersionMeta | null {
  return promptVersions[promptType]?.[version] || null;
}

// Get all versions for a prompt type
export function getPromptVersions(promptType: string): PromptVersionMeta[] {
  if (!promptVersions[promptType]) return [];
  
  return Object.values(promptVersions[promptType])
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
}

// Update performance metrics for a version
export function updateVersionMetrics(
  promptType: string,
  version: string,
  metrics: PromptVersionMeta['performanceMetrics']
): boolean {
  if (!
 POST /api/projects/generate 200 in 552114ms