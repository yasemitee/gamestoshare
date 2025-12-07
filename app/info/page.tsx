import { Container } from '@/components/layout/Container';
import { MainContentContainer } from '@/components/layout/MainContentContainer';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GoBackButton } from '@/components/ui/GoBackButton';
import { colors, gradients } from '@/lib/colors';
import { ActionButtons } from '@/components/listings/ActionButtons';
import { Divider } from '@/components/ui/Divider';
import { Button } from '@/components/ui/Button';
import { ContentSection } from '@/components/content/ContentSection';
import { ContentParagraph } from '@/components/content/ContentParagraph';
import { ContentSubtitle } from '@/components/content/ContentSubtitle';
import { Image } from '@/components/content/Image';
import { FAQItem } from '@/components/content/FAQItem';
import { NumberedList } from '@/components/content/NumberedList';
import { GradientTitle } from '@/components/ui/GradientTitle';
import { PageHeaderMeta } from '@/components/ui/PageHeaderMeta';
import { QuickNavigation } from '@/components/ui/QuickNavigation';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { SupportCard } from '@/components/content/SupportCard';
import { AnimatedContentWrapper } from '@/components/content/AnimatedContentWrapper';
import { Content } from 'next/font/google';

export const metadata = {
  title: 'Guide: How to use GTS - GamesToShare',
  description:
    'Learn how to use GamesToShare to share and access Steam game libraries through our comprehensive guide.',
  keywords: [
    'game sharing guide',
    'how to use gamestoshare',
    'steam family sharing tutorial',
    'game library sharing instructions',
    'gaming community guide',
    'share games tutorial',
    'using gamestoshare platform',
  ],
  openGraph: {
    title: 'Guide: How to use GTS - GamesToShare',
    description:
      'Learn how to use GamesToShare to share and access Steam game libraries through our comprehensive guide.',
    url: 'https://www.gamestoshare.com/info',
    images: [
      {
        url: 'https://www.gamestoshare.com/WebsiteBanner.jpg',
        width: 1200,
        height: 630,
        alt: 'GamesToShare How to Use Guide',
      },
    ],
    siteName: 'GamesToShare',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guide: How to use GTS - GamesToShare',
    description:
      'Learn how to use GamesToShare to share and access Steam game libraries through our comprehensive guide.',
    images: ['https://www.gamestoshare.com/WebsiteBanner.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: 'https://www.gamestoshare.com/info',
  },
};

// Static page - no need for function invocations
export const dynamic = 'force-static';

export default function InfoPage() {
  return (
    <Container>
      <Navbar />
      <MainContentContainer>
        <AnimatedContentWrapper>
          <GoBackButton />
          {/* Header */}
          <div className="mt-14">
            <GradientTitle className="mb-3">
              Guide: How to use GTS
            </GradientTitle>
            <PageHeaderMeta
              lastUpdated="Updated Nov 30, 2025"
              readTime="3 min read"
              actions={<ActionButtons showReport={false} showShare={true} />}
            />

            {/* Quick Navigation */}
            <QuickNavigation
              links={[
                { href: '#what-is-gts', label: 'WHAT IS GTS' },
                { href: '#how-does-it-work', label: 'HOW DOES IT WORK?' },
                { href: '#how-to-use', label: 'HOW TO USE THIS PLATFORM' },
                { href: '#faq', label: 'FAQ' },
                { href: '#support', label: 'SUPPORT' },
              ]}
            />

            {/* Content Sections */}
            <div className="space-y-16">
              {/* What is GamesToShare */}
              <ContentSection title="What is GamesToShare?">
                <ContentParagraph className="">
                  GamesToShare (GTS) is a platform where Steam users can share
                  their libraries and wishlists to connect with others. Anyone
                  with a Steam account can use it without logging in. The
                  platform is free to use and is ads-free.
                </ContentParagraph>
              </ContentSection>

              {/* Who is it for */}
              <ContentSection id="who-is-it-for" title="Who is it for?">
                <ContentParagraph className="mb-0">
                  GTS was designed specifically for steam users, altough we are
                  working on implementing new platforms. The ultimate goal is
                  for users to connect through friend requests and discover
                  other players with similar interests.
                </ContentParagraph>
              </ContentSection>

              <Divider />

              {/* Browsing Offers */}
              <section id="how-does-it-work">
                <ContentSection id="browsing-offers" title="Browsing Offers">
                  <ContentParagraph>
                    You can explore existing posts or create your own.
                  </ContentParagraph>
                  <NumberedList
                    items={[
                      'Use the search bar on the homepage or the dedicated search page to look up specific games or sort posts by date.',
                      'Click on a post to open it.',
                      "If you're interested, you can send a Steam friend request directly from the post.",
                    ]}
                  />
                  <ContentParagraph className="mt-4">
                    Additionally you can use the location filter to find friends
                    close to you.
                  </ContentParagraph>
                  <Image
                    img={{ src: '/Browsing.png', alt: 'Location Filter' }}
                  />
                </ContentSection>
                {/* Sending a Request */}
                <ContentSection
                  id="sending-request"
                  title="Sending a Request"
                  className="mt-16"
                >
                  <ContentParagraph>
                    Before you can send a request, the platform will check if
                    you're a good match for the post.
                  </ContentParagraph>
                  <ContentParagraph>
                    Your account must own at least one game that appears in the
                    "Wishlist" section of the post you're viewing.
                  </ContentParagraph>
                  <ContentParagraph>
                    Enter your Steam ID and wait for confirmation. If there's a
                    match, you'll be able to send a friend request or open the
                    user's Steam profile directly.
                  </ContentParagraph>
                  <div className="md:flex gap-6">
                    <Image
                      img={{
                        src: '/SendingRequest1.png',
                        alt: 'Sending Request',
                      }}
                    />
                    <Image
                      img={{
                        src: '/SendingRequest2.png',
                        alt: 'Sending Request',
                      }}
                    />
                    <Image
                      img={{
                        src: '/SendingRequest3.png',
                        alt: 'Sending Request',
                      }}
                    />
                  </div>
                </ContentSection>
              </section>
              <section id="how-to-use">
                {/* Creating a Post */}
                <ContentSection
                  id="creating-post"
                  title="Creating a Post"
                  className="mb-4"
                >
                  <ContentParagraph className="mb-8">
                    To publish a post, click the "CREATE A POST" button on the
                    right side of the navigation bar. You'll be asked to fill in
                    a few details.
                  </ContentParagraph>

                  {/* Steam ID */}
                  <ContentSubtitle>Steam ID</ContentSubtitle>
                  <ContentParagraph className="mb-0">
                    This is the link displayed at the top of your Steam profile,
                    for example:
                  </ContentParagraph>
                  <CodeBlock>
                    <span
                      className="break-all"
                      style={{
                        wordBreak: 'break-all',
                        overflowWrap: 'anywhere',
                        whiteSpace: 'normal',
                      }}
                    >
                      https://steamcommunity.com/profiles/76561199382517994
                    </span>
                  </CodeBlock>
                  <ContentParagraph className="mb-8">
                    You can choose whether to show your Steam username in the
                    post. If you leave the checkbox unticked, your name will
                    appear as "Anonymous". Note that if you choose to display
                    your Steam username, you are implicitly consenting to other
                    people to bypass our matching logic, so you are allowing
                    anyone to send you a friend request (that may be your actual
                    goal).
                  </ContentParagraph>

                  {/* Location */}
                  <ContentSubtitle>Location</ContentSubtitle>
                  <ContentParagraph className="mb-8">
                    Choose the location of your Steam store region. If your
                    location is already set on your profile, it will be
                    retrieved automatically. Otherwise, you will have to select
                    a location.
                  </ContentParagraph>

                  {/* Platform */}
                  <ContentSubtitle>Platform</ContentSubtitle>
                  <ContentParagraph className="mb-8">
                    The platform currently supports Steam only. Additional
                    platforms for consoles and PC are planned for future
                    updates.
                  </ContentParagraph>

                  {/* Description */}
                  <ContentSubtitle>Description</ContentSubtitle>
                  <ContentParagraph className="mb-8">
                    Use this space to add helpful details about your post. You
                    can mention your usual gaming hours, games you are currently
                    playing, or preferred ways to be contacted.
                  </ContentParagraph>

                  {/* Wishlist */}
                  <ContentSubtitle>Wishlist</ContentSubtitle>
                  <ContentParagraph className="mb-8">
                    Add the games you'd like to receive. If your Steam wishlist
                    is public, GTS will import it automatically. You can add
                    more titles using the search bar or remove any by hovering
                    on them and clicking the X. Other users will be able to
                    match with you if they own at least one game in your
                    Wishlist.
                  </ContentParagraph>

                  {/* Library */}
                  <ContentSubtitle>Library</ContentSubtitle>
                  <ContentParagraph className="mb-16">
                    List the games you've got. If your Steam library is public,
                    GTS will import it automatically. You can add or remove
                    games the same way as in the "Wishlist" section.
                  </ContentParagraph>

                  <Image
                    className="mb-12 mb-16"
                    img={{ src: '/Create.png', alt: 'Library Games' }}
                  />

                  {/* Verification Step */}
                  <ContentSubtitle>Verification Step</ContentSubtitle>
                  <ContentParagraph className="mb-8">
                    Before you post (or send an invitation), GTS needs to verify
                    that you truly own the Steam account you have inserted.
                    There's no registration or Steam login required. Simply
                    place the provided verification code ("GTS") in your Steam
                    profile bio. Once verified, your post will be published.
                  </ContentParagraph>
                </ContentSection>
              </section>

              {/* Frequent Asked Questions */}
              <ContentSection
                id="faq"
                title="Frequent Asked Questions"
                className="mb-8"
              >
                <ContentParagraph className="mb-8">
                  The following information is general guidance about how Steam
                  Family Sharing works on Steam itself. These features belong to
                  Valve and are not part of GTS. GTS does not manage, automate,
                  or provide Family Sharing.
                </ContentParagraph>
                <FAQItem
                  question="How do I enable Family Sharing?"
                  answer="Log into Steam > Settings > Family > Authorize Library Sharing on this device."
                />

                <FAQItem
                  question="How can I add people to my Steam Family?"
                  answer="You need to be friends first. You will see the eligible accounts under Settings > Family."
                />

                <FAQItem
                  question="Is there a limit to the number of accounts I can share my Library with?"
                  answer="Yes, a Family Library can be shared with up to 5 accounts and up to 10 devices in 90 days."
                />

                <FAQItem
                  question="Can I share a specific game?"
                  answer="Yes, you can share a specific game by flagging all the other games as private. This is a Steam feature and is not provided or managed by GTS."
                />

                <FAQItem
                  question="Can I get banned from Family Sharing?"
                  answer="Offline and solo games are 100% safe, but you can get a VAC ban if your copy is used to cheat in a multiplayer game protected by Valve Anti-Cheat (VAC). Only the cheater and the owner of the copy will be affected by the ban. "
                />
              </ContentSection>

              {/* We support you & You support us */}
              <section
                id="support"
                className="grid grid-cols-1 md:grid-cols-2 gap-28"
              >
                <SupportCard
                  title="We support you"
                  description={[
                    "If you're still having trouble, you can contact the staff on the Discord Server.",
                    'Write a message in the "Help" text channel, where other users and our team can message back and help you out.',
                  ]}
                  buttonText="JOIN OUR SERVER"
                  buttonIcon="/Discord.svg"
                  buttonIconAlt="Discord"
                  buttonGradient={gradients.main}
                  buttonHref="https://discord.gg/mavhKaDRCv"
                />

                <SupportCard
                  title="You support us"
                  description={[
                    'Please consider tipping or donating to help us maintain the platform and provide assistance to users.',
                    'Donors will get the "Donor" tag on the platform and on the Discord Server.',
                  ]}
                  buttonText="DONATE"
                  buttonIcon="/Heart.svg"
                  buttonIconAlt="Heart"
                  buttonGradient={gradients.pink}
                  buttonHref="https://buymeacoffee.com/gamestoshare"
                />
              </section>
            </div>
          </div>
        </AnimatedContentWrapper>
      </MainContentContainer>
      <Footer />
    </Container>
  );
}
