import emitter from '@/lib/emitter';

export async function POST(req) {
  const body = await req.json();
  emitter.emit('einsatz-update', body);

  return Response.json({ success: true });
}
