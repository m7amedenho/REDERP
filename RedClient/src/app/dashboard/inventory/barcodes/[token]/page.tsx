import TokenClient from "./ui";

type Params = Promise<{ token: string }>;

export default async function BarcodeTokenPage(props: { params: Params }) {
  const { token } = await props.params;
  return <TokenClient token={token} />;
}
