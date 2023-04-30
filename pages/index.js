import Head from "next/head"
import { Inter } from "next/font/google"
import Header from "../components/Header"
import ElpisVault from "../components/ElpisVault"
import ElpisStack from "../components/ElpisStack"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    return (
        <>
            <Head>
                <title>Elpis vault</title>
                <meta name="description" content="blablabla" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <ElpisVault />
            <ElpisStack />
        </>
    )
}
