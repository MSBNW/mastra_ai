# Error Handling (Client SDK)

The Mastra Client SDK has built-in mechanisms for error handling and automatic retries for failed requests. This ensures your application can gracefully handle issues like network failures or missing resources.

## Catching Errors

All client API methods can throw errors (for example, if an agent ID is not found, or a network request fails). You should catch these errors in your code:

```ts
try {
  const agent = client.getAgent("agent-id");
  const response = await agent.generate({ messages: [ { role: "user", content: "Hello" } ] });
} catch (error) {
  console.error("An error occurred:", error.message);
}
```

In this example, if `getAgent` fails to find the specified agent or if `generate` fails, the error is caught and handled (logging the error message).

## Retry Mechanism

The client automatically retries failed HTTP requests using an exponential backoff strategy (unless configured otherwise via the `retries` and `backoffMs` options):

```ts
const client = new MastraClient({
  baseUrl: "http://localhost:4111",
  retries: 3,      // number of retry attempts
  backoffMs: 300,  // initial backoff time (ms)
  maxBackoffMs: 5000 // max backoff time (ms)
});
```

If a request fails, the SDK will retry it up to the specified number of times, waiting progressively longer between attempts (backoff doubles each time up to maxBackoffMs). The default behavior (if not configured) is 3 attempts, starting with 300ms delay, doubling each retry.

### How Retries Work

1. **First attempt fails** → Wait 300ms (backoffMs) before retrying.  
2. **Second attempt fails** → Wait 600ms (doubles to 2× backoff) before next retry.  
3. **Third attempt fails** → Wait 1200ms (doubles again) before next retry.  
4. **Final attempt fails** → If all retries are exhausted, throw the error to the caller.

(If `maxBackoffMs` is defined, the backoff delay will not exceed that value.)

By understanding and configuring error handling:
- You ensure that transient errors (like brief network issues) are automatically retried.
- You can catch and handle persistent errors in your application code to prevent crashes and provide user feedback.
