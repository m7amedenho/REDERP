import SessionClient from "./ui";

type Params = Promise<{ sessionId: string }>;

export default async function StockCountSessionPage(props: { params: Params }) {
  const { sessionId } = await props.params;
  return <SessionClient sessionId={sessionId} />;
}
