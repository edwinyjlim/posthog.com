import CloudinaryImage from 'components/CloudinaryImage'
import React from 'react'
import Link from 'components/Link'
import {
    IconLaptop,
    IconWrench,
    IconHandwave,
    IconCode2,
    IconChip,
    IconMemory,
    IconScreen,
    IconSignal,
    IconBatteryCharge,
    IconExpand45,
    IconBox,
    IconPhone,
    IconButton,
    IconRuler,
    IconInfinity,
    IconExternal,
    IconDeskHog,
} from '@posthog/icons'
import {
    IconAsterisk,
    IconBolt,
    IconBuilding,
    IconCursorClick,
    IconEye,
    IconFlask,
    IconGraph,
    IconMessage,
    IconPeople,
    IconPerson,
    IconPlus,
    IconRevert,
    IconRewindPlay,
    IconServer,
    IconStack,
    IconToggle,
    IconShare,
    IconPlay,
    IconHandMoney,
    IconThumbsUp,
    IconHeartFilled,
    IconThoughtBubble,
    IconCode,
} from '@posthog/icons'
import { CallToAction } from 'components/CallToAction'
import { Hero } from 'components/Products/Hero'
import { Subfeature } from 'components/Products/Subfeature'
import CTA from 'components/Home/CTA'
import { FAQ } from 'components/Products/FAQ'
import Tooltip from 'components/Tooltip'
import { TextCard } from 'components/Products/TextCard'
import { SEO } from 'components/seo'
import { useLayoutData } from 'components/Layout/hooks'
import { PRODUCT_COUNT } from '../../../constants'
import { Bang } from 'components/Icons'
import { motion } from 'framer-motion'

interface AppProps {
    image?: string
    title: string
    description: string
    author: string
    authorUrl: string
    isBuildYourOwn?: boolean
}

const App = ({ image, title, description, author, authorUrl, isBuildYourOwn }: AppProps) => (
    <div className="h-[174px] relative group [perspective:1000px] text-center">
        <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front Face */}
            <div className="absolute h-full w-full [backface-visibility:hidden] flex flex-col justify-center items-center">
                {image ? (
                    <CloudinaryImage src={image} alt={`${title} screenshot`} className="w-full max-w-[224px] mx-auto" />
                ) : (
                    <h4 className="text-xl font-bold mb-2">{title} →</h4>
                )}
            </div>
            {/* Back Face */}
            <div className="absolute h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-accent dark:bg-accent-dark border border-light dark:border-dark rounded p-6 duration-150 flex flex-col justify-center items-center">
                <div className="text-center">
                    <h4 className="text-xl font-bold mb-2">{title}</h4>
                    <p className="text-[15px] text-primary/80 dark:text-primary-dark/80 mb-2">{description}</p>
                    {!isBuildYourOwn ? (
                        <p className="text-sm">
                            <b>Built by:</b> <Link to={authorUrl}>{author}</Link>
                        </p>
                    ) : (
                        <p>
                            <Link to="https://github.com/PostHog/DeskHog" className="text-red dark:text-yellow">
                                Get started on GitHub
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    </div>
)

const ProductIcon = ({
    name,
    url,
    color,
    icon,
}: {
    name: string
    url: string
    color: string
    icon: React.ReactNode
}) => {
    return (
        <Tooltip content={name}>
            <span className="relative">
                <Link to={url} className={`inline-flex bg-${color}/10 text-${color} dark:text-${color} rounded p-2`}>
                    <span
                        className={`w-6 h-6 text-${color} hover:text-${color} dark:text-${color} dark:hover:text-${color}`}
                    >
                        {icon}
                    </span>
                </Link>
            </span>
        </Tooltip>
    )
}

const product = {
    slug: 'deskhog',
    lowercase: 'deskhog',
    capitalized: 'DeskHog',
}

const subfeaturesItemCount = 3
const subfeatures = [
    {
        title: 'Open-source',
        description:
            "We're open-source, and so is DeskHog. It's yours to hack. Build your own games and tools with AI editors (or C++ if you're a masochist).",
        icon: <IconCode2 />,
    },
    {
        title: '3D printed',
        description:
            "<a href='/community/profiles/31731'>Danilo</a> prints these at home and assembles them by hand. It's a friction-fit labor of love. Or you can print your own from the files on GitHub.",
        icon: <IconWrench />,
    },
    {
        title: 'Palm-sized',
        description:
            "DeskHog is small enough to fit in your pocket. It's got a 10-hour battery life, WiFi, and a cute flashing LED so you can find it in the dark.",
        icon: <IconHandwave />,
    },
]

interface HeroDeskHogProps {
    icon: React.ReactNode
    color: string
    beta?: boolean
    product: string
    title: string
    description: string
}

const HeroDeskHog = ({ color, icon, beta, product, title, description }: HeroDeskHogProps): JSX.Element => {
    return (
        <section>
            <div className="flex gap-1.5 justify-center items-center mb-3">
                <span className={`w-6 h-6 text-${color}`}>{icon}</span>
                <span className="text-[15px] font-semibold text-opacity-60">{product}</span>
                {beta && (
                    <span className="text-xs font-semibold text-opacity-60 bg-yellow px-1 py-0.5 rounded-sm uppercase text-primary">
                        Beta
                    </span>
                )}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-center mb-4 md:mb-2 text-balance px-2">
                It's a developer <span className="text-red dark:text-yellow">toy</span> that brings developers{' '}
                <span className="text-red dark:text-yellow">joy</span>
            </h1>
            <p className="text-base sm:text-lg font-semibold text-center text-opacity-75 mb-5 px-4">
                (And it costs less than a Star Wars LEGO set)
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 mb-12 px-4">
                <CallToAction href="https://posthog.com/merch" type="primary" externalNoIcon>
                    <>Buy a kit now</>
                </CallToAction>
                <CallToAction href="https://github.com/PostHog/DeskHog" type="secondary" externalNoIcon>
                    <>
                        3D print it
                        <IconExternal className="size-4 inline-block ml-1" />
                    </>
                </CallToAction>
            </div>
        </section>
    )
}

// Working video section - currently using Cloudinary video embed
// const VideoDeskHog = () => (
//     <section id="demo-video" className={`overflow-hidden h-auto max-h-[90vh] mb-8 pt-10`}>
//         <div className="inline-flex mx-auto relative overflow-hidden w-full aspect-video">
//             <iframe
//                 src="https://res.cloudinary.com/dmukukwp6/video/upload/Termagotchi_084775b39f.mp4"
//                 className="rounded aspect-video m-0 shadow-xl"
//                 allow="autoplay"
//             />
//             <div className="absolute top-10 -right-10 md:top-10 md:-right-14">
//                 <a
//                     href="https://github.com/PostHog/DeskHog"
//                     className="inline-block bg-yellow text-black hover:text-black px-8 py-1 md:px-12 md:py-2 text-sm md:text-base font-semibold shadow-lg transform rotate-45"
//                 >
//                     <span className="text-black">Build it yourself</span>
//                     <IconExternal className="size-4 inline-block ml-1 relative -top-0.5" />
//                 </a>
//             </div>
//         </div>
//     </section>
// )

// Define DeskHogCTA component
const DeskHogCTA = () => {
    const headingClasses = 'font-bold text-center text-4xl lg:text-5xl mb-3 text-red dark:text-yellow'
    const subheadingClasses =
        'text-center text-primary dark:text-primary-dark opacity-75 dark:opacity-100 max-w-xl mx-auto mb-6'

    return (
        <section className="relative pt-8 md:pt-0 px-5 lg:px-0">
            <h2 className={headingClasses}>Ready to get building?</h2>
            <h3 className={subheadingClasses}>Maybe it'll help if we make it look cuter</h3>

            <div className="md:grid grid-cols-2 gap-16 md:pt-12 pb-16 max-w-5xl mx-auto">
                <div className="relative text-center md:text-right">
                    <div className="mb-6">
                        <CloudinaryImage
                            src="https://res.cloudinary.com/dmukukwp6/image/upload/deskhog_smiling_36bb2647ff.png"
                            alt="DeskHog marketing image"
                            className="max-w-[350px] mx-auto md:mx-0"
                        />
                    </div>

                    {/* Fun animated element similar to CTA.js */}
                    <div className="absolute top-4 md:-top-8 -right-8 md:-right-12">
                        <div className="relative">
                            <Bang className="w-[120px] md:w-[150px] animate-grow" />
                            <p className="px-4 md:px-6 text-center m-0 absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center text-black uppercase !leading-none font-bold text-sm md:text-base rotate-6">
                                <span className="text-xs">Now with</span>
                                100% more <br />
                                nostalgia
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center md:text-left">
                    <div className="mb-6">
                        <span className="bg-green inline-flex items-center gap-1 px-2 py-1 rounded-sm">
                            <span className="w-3 h-3">
                                <IconWrench className="fill-white" />
                            </span>
                            <span className="uppercase font-semibold text-xs text-white">DIY-friendly</span>
                        </span>
                        <p className="text-4xl font-bold m-0 md:mt-2">DeskHog Kit</p>
                        <p className="opacity-50 m-0 mb-4 text-sm">
                            Act now and get a palm-sized slice of developer joy.
                        </p>
                    </div>
                    <ul className="p-0 m-0 space-y-2 text-left">
                        <li className="list-none">
                            <div className="flex items-baseline gap-1 justify-center md:justify-start">
                                <s className="font-bold text-xl">$50</s>
                                <span className="font-bold text-red text-xl uppercase">$35</span>
                                <br className="md:hidden" />
                                <span className="text-xs opacity-50">
                                    <span className="text-sm">Limited stock remaining</span>
                                </span>
                            </div>
                        </li>
                    </ul>

                    <div className="py-6">
                        <CallToAction
                            href="https://posthog.com/merch"
                            type="primary"
                            size="absurd"
                            width="64"
                            className="animate-grow-sm"
                            externalNoIcon
                        >
                            Get your DeskHog
                        </CallToAction>
                    </div>

                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <span className="bg-accent dark:bg-accent-dark rounded h-8 w-8 p-1">
                            <IconHandwave className="opacity-75" />
                        </span>
                        <p className="text-left text-sm text-primary/50 dark:text-primary-dark/50 leading-tight mb-0">
                            <strong>Supplies are limited, but more are on the way.</strong>{' '}
                            <br className="hidden md:block" />
                            Don't want to wait? You can{' '}
                            <a href="https://github.com/PostHog/DeskHog" target="_blank" rel="noopener noreferrer">
                                3D print it
                            </a>
                            !
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

// Expandable Callout Component
const ExpandableCallout = () => {
    return (
        <div className="col-span-2 bg-accent dark:bg-accent-dark py-4 px-8 rounded-lg w-full max-w-4xl mx-auto">
            <div className="mt-4 flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                    <h2 className="text-center md:text-left mb-4">
                        You can even <span className="text-red dark:text-yellow">add your own hardware</span>
                    </h2>
                    <p className="mb-3">
                        Want to add more buttons, speakers, or sensors? How about a Bluetooth module? All you need to do
                        is plug it into the I²C port and patch in the firmware.
                    </p>
                    <p className="mb-3">
                        We already made a prototype DeskHog Pro to prove what's possible. It has a macropad of buttons,
                        and a huge dial so you can crank up the vibes.
                    </p>
                    <p>
                        Got ideas for something else we should add? <a href="https://x.com/posthog">Let us know!</a>
                    </p>
                </div>
                <div className="shrink-0 w-full md:w-80 flex justify-center">
                    <CloudinaryImage
                        src="https://res.cloudinary.com/dmukukwp6/image/upload/deskhog_max_904ca43b3e.png"
                        alt="DeskHog Pro"
                        className="w-full max-w-[280px]"
                    />
                </div>
            </div>
        </div>
    )
}

// Vibe Coding Boxout Component
const VibeCodingBoxout = () => {
    return (
        <div className="bg-accent dark:bg-accent-dark border border-light dark:border-dark rounded-lg p-4 mb-14 max-w-2xl mx-4 md:mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="flex-shrink-0">
                    <CloudinaryImage
                        src="https://res.cloudinary.com/dmukukwp6/image/upload/29970a1b_7c79_420c_ac17_83b189f2af32_0a700168a7.png"
                        alt="Make your own games"
                        className="w-full md:w-[215px] h-auto"
                    />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">It's never been easier to make your own games</h3>
                    <p className="leading-normal text-sm text-primary dark:text-primary-dark mb-1">
                        Don&apos;t want to spend all evening writing C++? That's why DeskHog is optimized for vibe
                        coding!
                    </p>
                    <p className="leading-normal text-sm text-primary dark:text-primary-dark mb-0">
                        We've included ready-made files to give AI agents the context they need, plus{' '}
                        <a href="/tutorials/deskhog-claude-tutorial">a guide to get you started</a>. Many of the games
                        above were made in exactly this way!
                    </p>
                </div>
            </div>
        </div>
    )
}

export const ProductDeskHog = () => {
    const { fullWidthContent } = useLayoutData()
    return (
        <>
            <SEO
                title="DeskHog - A developer toy from PostHog"
                description="It's a developer toy that brings developers joy. Open-source. 3D-printed. Palm-sized."
                image={`/images/og/deskhog.jpg`}
            />
            <div
                className={`${
                    fullWidthContent ? 'max-w-full px-8' : 'max-w-7xl mx-auto'
                } px-4 sm:px-5 pt-6 sm:pt-10 pb-10`}
            >
                <HeroDeskHog
                    color="blue"
                    icon={<IconDeskHog />}
                    product={product.capitalized}
                    title="It's a developer toy that <br /> <span className='text-red dark:text-yellow'>brings developers joy</span>"
                    description="Pre-built kits coming soon. DIY version available now."
                />
                {/* <VideoDeskHog /> */}
                <section id="demo-video" className="mb-0 pt-0 md:px-2 sm:px-0">
                    <div className="flex justify-center">
                        <div className="w-full max-w-[800px] lg:max-w-[1000px]">
                            <div className="relative aspect-video rounded overflow-hidden shadow-xl">
                                <iframe
                                    src="https://www.youtube-nocookie.com/embed/8hMfu3kXR20"
                                    title="DeskHog Demo Video"
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div id="features">
                <section className="max-w-7xl mx-auto px-4 sm:px-5 pb-6">
                    <div className="mb-4">
                        <ul
                            className={`list-none p-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${subfeaturesItemCount} gap-4`}
                        >
                            {subfeatures.map((subfeature, index) => {
                                return <Subfeature {...subfeature} key={index} />
                            })}
                        </ul>
                    </div>

                    <div className="flex flex-col-reverse items-center md:flex-row gap-6 md:gap-8 pt-12 sm:pt-16 md:pt-20 mb-12 sm:mb-16 md:mb-20">
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4">
                                But what is DeskHog really?
                                <br />
                                <span className="text-red dark:text-yellow">It's a teeny, tiny, beast.</span>
                            </h2>
                            <p>
                                DeskHog packs a ESP32-S3 Reverse TFT Feather in a custom-made 3D printed case. It comes
                                complete with a 240x135 color TFT display, a 10-hour battery life, WiFi, and a cute
                                little LED.
                            </p>
                            <p>
                                It's a hand-made micro games console. It's a desktop terminal for PostHog data. It's a
                                friend.
                            </p>
                            <div className="inline-grid grid-cols-2 [&>*]:p-2 divide-y divide-border dark:divide-border-dark border border-light dark:border-dark text-sm mb-6">
                                <strong className="border-r border-light dark:border-dark">Can it play Pong?</strong>
                                <span className="!border-t-0">Yes.</span>
                                <strong className="border-r border-light dark:border-dark">
                                    Can it play Flappy Bird?
                                </strong>
                                <span>Yes.</span>
                                <strong className="border-r border-light dark:border-dark">Can it play Doom?</strong>
                                <span>...We're working on it.</span>
                            </div>
                            <p className="text-sm mb-4 border-l-4 border-light dark:border-dark pl-2 py-1">
                                <strong>
                                    Want <i>more</i> hardware?
                                </strong>{' '}
                                The board includes an I²C expansion port, just for people like you.
                            </p>
                        </div>
                        <aside className="shrink-0 w-full md:w-auto md:basis-[500px] flex justify-center">
                            <CloudinaryImage
                                src="https://res.cloudinary.com/dmukukwp6/image/upload/hogzilla_73b822a689.png"
                                alt="DeskHog is a beast"
                                className="w-full max-w-[350px] sm:max-w-[400px] md:max-w-[470px]"
                            />
                        </aside>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl text-center mb-2 px-2">
                        Obviously it comes with games
                    </h2>
                    <h3 className="text-lg sm:text-xl text-center font-medium mb-8 sm:mb-12 px-4">
                        Also, some important business tools so you have an excuse to expense your purchase
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-6">
                        <App
                            image="https://res.cloudinary.com/dmukukwp6/image/upload/0a21fcc0_41df_4469_bb70_456919ca1a05_6dd8ca3f3f.png"
                            title="Paddle"
                            description="It's Pong, but with a different name. It's perfect for playing on the toilet. Apparently."
                            author="Leon Daly"
                            authorUrl="https://posthog.com/community/profiles/30833"
                        />
                        <App
                            image="https://res.cloudinary.com/dmukukwp6/image/upload/0e9ed66b_2907_4e08_b105_99f15bfee041_3bca3468a4.png"
                            title="Flappy Hog"
                            description="Despite the title, this game has neither hedgehogs nor flapping."
                            author="Joe Martin"
                            authorUrl="https://posthog.com/community/profiles/29070"
                        />
                        <App
                            image="https://res.cloudinary.com/dmukukwp6/image/upload/e90c7a39_484a_40a0_94b1_693962bbd13e_52085d0806.png"
                            title="One Button Dungeon"
                            description="It's a roguelike throwback about an endless corridor. Such is life."
                            author="Joe Martin"
                            authorUrl="https://posthog.com/community/profiles/29070"
                        />
                        <App
                            image="https://res.cloudinary.com/dmukukwp6/image/upload/c8a2a90c_bea7_4c99_99ab_0c67e4d97d48_24c67b992e.png"
                            title="Three Button Dungeon"
                            description="It's a roguelike throwback, but this time the corridor is a desert. Wow!"
                            author="Joe Martin"
                            authorUrl="https://posthog.com/community/profiles/29070"
                        />
                        <App
                            image="https://res.cloudinary.com/dmukukwp6/image/upload/8404130b_d081_45e3_9187_80c20a8c53fb_959f19a07e.png"
                            title="Friend"
                            description="DeskHog is a friend. These inspirational quotes prove it."
                            author="Danilo Campos"
                            authorUrl="https://posthog.com/community/profiles/31731"
                        />
                        <App
                            image="https://res.cloudinary.com/dmukukwp6/image/upload/5598bc45_d969_45c3_bce9_3cc4c5cf0ad5_ef111c5357.png"
                            title="Awkwardness Avoider"
                            description="Hate smalltalk? These icebreakers will help."
                            author="Annika Schmid"
                            authorUrl="https://posthog.com/community/profiles/28619"
                        />
                        <App
                            image="https://res.cloudinary.com/dmukukwp6/image/upload/d507387e_798f_4fe8_9a4a_c0d13e7525a3_f842494c9e.png"
                            title="Pomodoro Timer"
                            description="Gives you time to ponder 20 tomatoes."
                            author="Annika Schmid"
                            authorUrl="https://posthog.com/community/profiles/28619"
                        />
                        <App
                            image="https://res.cloudinary.com/dmukukwp6/image/upload/3c4149d1_f52b_4861_96f5_ee5123b0dd39_9441f50703.png"
                            title="Insight Keeper-upper"
                            description="Grab graphs from PostHog and squint at them."
                            author="Danilo Campos"
                            authorUrl="https://posthog.com/community/profiles/31731"
                        />
                    </div>
                </section>
            </div>

            <VibeCodingBoxout />

            <section className="bg-accent dark:bg-accent-dark py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8">
                    <div className="flex flex-col-reverse items-center md:flex-row gap-6 md:gap-8">
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center md:text-left mb-4">
                                You may be wondering <br />
                                <span className="text-red dark:text-yellow">why we're making hardware</span>
                            </h2>
                            <p>
                                DeskHog started as a joke in our internal Slack, but then Danilo{' '}
                                <Link to="/blog/welcome-to-deskhog">decided to build it anyway</Link>. Two prototypes
                                and one hackathon later, we had a working version with a bunch of apps.
                            </p>
                            <p>
                                Ultimately, we're not sure if DeskHog will be a success, but we've has a lot of fun
                                building it. And we're selling it as cost so you can join in!
                            </p>
                        </div>
                        <aside className="shrink-0 w-full md:w-auto md:basis-[500px] flex justify-center mb-6 md:mb-0">
                            <div className="w-full max-w-[400px] sm:max-w-[450px] md:max-w-[470px]">
                                <div className="relative aspect-video rounded overflow-hidden shadow-xl">
                                    <iframe
                                        src="https://www.youtube-nocookie.com/embed/lqeD2vvAA4w"
                                        title="DeskHog Demo Video"
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* DeskHog Specs Section */}
            <section className="py-8 sm:py-10">
                <div className={`${fullWidthContent ? 'max-w-full px-8' : 'max-w-7xl mx-auto'} px-4 sm:px-5`}>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16 text-primary dark:text-primary-dark px-2"
                        dangerouslySetInnerHTML={{
                            __html: 'The <s class="opacity-60">devil</s> <span class="text-red dark:text-yellow">power</span> is in the details<br />',
                        }}
                    />
                    <div className="flex justify-center">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-x-16 gap-y-8 sm:gap-y-10">
                            {[
                                {
                                    label: 'Processor',
                                    icon: <IconChip className="fill-primary dark:fill-primary-dark opacity-75" />,
                                    details: 'ESP32-S3 Dual Core\n240MHz Tensilica',
                                },
                                {
                                    label: 'Memory',
                                    icon: <IconMemory className="fill-primary dark:fill-primary-dark opacity-75" />,
                                    details: '4MB Flash, 2MB PSRAM\n512KB SRAM',
                                },
                                {
                                    label: 'Display',
                                    icon: <IconScreen className="fill-primary dark:fill-primary-dark opacity-75" />,
                                    details: '1.14" Color IPS TFT\n240x135 pixels (ST7789)\n',
                                },
                                {
                                    label: 'Connectivity',
                                    icon: <IconSignal className="fill-primary dark:fill-primary-dark opacity-75" />,
                                    details: '2.4GHz Wi-Fi (802.11b/g/n)\nBluetooth LE (BLE)',
                                },
                                {
                                    label: 'Power & Battery',
                                    icon: (
                                        <IconBatteryCharge className="fill-primary dark:fill-primary-dark opacity-75" />
                                    ),
                                    details:
                                        'USB Type-C / LiPo Battery\nBuilt-in Charging, MAX17048 Monitor\nLow Power Sleep (40-50µA)',
                                },
                                {
                                    label: 'Expansion',
                                    icon: <IconExpand45 className="fill-primary dark:fill-primary-dark opacity-75" />,
                                    details: 'STEMMA QT (I²C)\nFeatherWing Compatible\nSerial Debug Pin',
                                },
                                {
                                    label: 'Enclosure',
                                    icon: <IconBox className="fill-primary dark:fill-primary-dark opacity-75" />,
                                    details: 'Custom 3D Printed (PETG)\nOpen source files available',
                                },
                                {
                                    label: 'Inputs',
                                    icon: <IconButton className="fill-primary dark:fill-primary-dark opacity-75" />,
                                    details: '3x User Tactile Buttons\nReset & DFU buttons',
                                },
                                {
                                    label: 'Dimensions',
                                    icon: <IconRuler className="fill-primary dark:fill-primary-dark opacity-75" />,
                                    details: '~70mm x 40mm x 15mm\nPerfectly-palm-sized',
                                },
                            ].map((spec, index) => (
                                <div key={index} className="flex flex-col sm:flex-row items-start gap-4">
                                    <span className="text-primary/50 size-8 -mt-1 shrink-0">{spec.icon}</span>
                                    <div>
                                        <h3 className="text-base font-bold text-primary/80 dark:text-primary-dark/80 mb-1">
                                            {spec.label}
                                        </h3>
                                        <p
                                            className="text-sm text-primary dark:text-primary-dark whitespace-pre-line"
                                            dangerouslySetInnerHTML={{ __html: spec.details }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* New expandable callout */}
                    <div className="text-base italic font-semibold text-center w-full pb-6 mt-12">
                        Oh, and there's an I²C expansion port, so...
                    </div>
                    <ExpandableCallout />
                </div>
            </section>

            {/* DeskHogCTA Section Wrapper */}
            <div className={`${fullWidthContent ? 'max-w-full px-8' : 'mx-auto'} relative px-4 sm:px-5 pb-10`}>
                <section className="mb-0">
                    <DeskHogCTA />
                </section>
            </div>
        </>
    )
}

export default ProductDeskHog
