import Head from "next/head";

//The other layout doesn't cover the vendor aspect of things
export const GlobalLayout = ({ children }) => {
  return (
    <div>
      {/* GLOBAL HEAD TAGS  */}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#02247a" />
        <link rel="icon" href="/home-alt.svg" />
        <link rel="apple-touch-icon" href="/home-alt.svg" />
      </Head>
      {children}
      {/* GLOBAL STYLES  */}
      <style jsx global>{`
        :root {
          --box: 0 1px 6px 0;
          --softgrey: rgba(32, 33, 36, 0.28);
          --lightblue: #cbd8f9;
          --deepblue: #02247a;
          --text: #626262;
          --softblue: rgb(238, 238, 245);
        }
      `}</style>
    </div>
  );
};
