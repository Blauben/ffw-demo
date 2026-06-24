import emitter from '@/lib/emitter';

export async function GET(request) {
  const stream = new ReadableStream({
    start(controller) {
      let closed = false;

      const send = chunk => {
        if (closed) {
          return;
        }

        controller.enqueue(chunk);
      };

      const onData = data => {
        send(`data: ${JSON.stringify(data)}\n\n`);
      };

      emitter.on('einsatz-update', onData);

      send(': connected\n\n');

      const heartbeat = setInterval(() => {
        send(': keep-alive\n\n');
      }, 15000);

      const cleanup = () => {
        if (closed) {
          return;
        }

        closed = true;
        clearInterval(heartbeat);
        emitter.off('einsatz-update', onData);
        try {
          controller.close();
        } catch {
          // The stream may already be closed if the response ended first.
        }
      };

      request.signal.addEventListener('abort', cleanup, { once: true });
    },
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
