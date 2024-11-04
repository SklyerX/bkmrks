import Image from "next/image";

export default function Home() {
  const string = process.env.DATABASE_URL;

  return <div>{string}</div>;
}
