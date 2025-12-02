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
import { ImagePlaceholder } from '@/components/content/ImagePlaceholder';
import { FAQItem } from '@/components/content/FAQItem';
import { NumberedList } from '@/components/content/NumberedList';
import { GradientTitle } from '@/components/ui/GradientTitle';
import { PageHeaderMeta } from '@/components/ui/PageHeaderMeta';
import { QuickNavigation } from '@/components/ui/QuickNavigation';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { SupportCard } from '@/components/content/SupportCard';

// Static page - no need for function invocations
export const dynamic = 'force-static';

export default function InfoPage() {
  return (
    <Container>
      <Navbar />
      <MainContentContainer>
        <GoBackButton />
        {/* Header */}
        <div className="mt-14">
          <GradientTitle className="mb-3">Guide: How to use GTS</GradientTitle>
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
                GamesToShare is a platform where Steam users share access to
                games through their Steam accounts. Anyone with a Steam account
                can use it, and it's free to play. Users share their own
                libraries with others by sending friend requests on Steam.
              </ContentParagraph>
            </ContentSection>

            {/* Who is it for */}
            <ContentSection id="who-is-it-for" title="Who is it for?">
              <ContentParagraph className="mb-0">
                GTS is designed for people who want access to try new games
                without buying them right away.
              </ContentParagraph>
              <ContentParagraph className="">
                By trading, two users create a Steam Family and share access to
                each other's libraries, creating a balanced exchange.
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
                    'Use the search bar on the homepage or the dedicated search page to look up specific games or sort offers by date.',
                    'Click on a post to open it.',
                    "If you're interested, you can send a Steam friend request directly from the post.",
                  ]}
                />
                <ContentParagraph className="mt-4">
                  Additionally you can use the location filter to find friends
                  close to you.
                </ContentParagraph>
                <ImagePlaceholder />
              </ContentSection>
              {/* Sending a Request */}
              <ContentSection id="sending-request" title="Sending a Request">
                <ContentParagraph>
                  Before you can send a request, the platform will check if
                  you're able to trade.
                </ContentParagraph>
                <ContentParagraph>
                  Your account must own at least one game that appears in the
                  "Looking for" section of the post you're viewing.
                </ContentParagraph>
                <ContentParagraph>
                  Enter your Steam ID and wait for confirmation. If there's a
                  match, you'll be able to send a friend request or open the
                  user's Steam profile directly.
                </ContentParagraph>
                <ImagePlaceholder />
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
                  To publish an offer, click the post button on the right side
                  of the navigation bar. You'll be asked to fill in a few
                  details.
                </ContentParagraph>

                {/* Steam ID */}
                <ContentSubtitle>Steam ID</ContentSubtitle>
                <ContentParagraph className="mb-0">
                  This is the link displayed at the top of your Steam profile,
                  for example:
                </ContentParagraph>
                <CodeBlock>
                  https://steamcommunity.com/profiles/76561199382517992
                </CodeBlock>
                <ContentParagraph className="mb-8">
                  You can choose whether to show your Steam username in the
                  post. If you leave the checkbox unticked, your name will
                  appear as "Anonymous".
                </ContentParagraph>

                {/* Location */}
                <ContentSubtitle>Location</ContentSubtitle>
                <ContentParagraph className="mb-8">
                  Choose the location of your Steam store region. A Steam Family
                  can only be created between accounts in the same store region,
                  so this is important. If your location is already set on your
                  profile, it will be retrieved automatically. Otherwise, you
                  will have to select a location.
                </ContentParagraph>

                {/* Platform */}
                <ContentSubtitle>Platform</ContentSubtitle>
                <ContentParagraph className="mb-8">
                  The platform is currently GTS only supports Steam for sharing.
                  Additional platforms for consoles and PC are planned for
                  future updates.
                </ContentParagraph>

                {/* Description */}
                <ContentSubtitle>Description</ContentSubtitle>
                <ContentParagraph className="mb-8">
                  Use this space to add helpful details about your trade. You
                  can mention your usual gaming hours, games you are currently
                  playing and not willing to trade, or preferred ways to be
                  contacted.
                </ContentParagraph>

                {/* Looking For */}
                <ContentSubtitle>Looking For</ContentSubtitle>
                <ContentParagraph className="mb-8">
                  Add the games you'd like to play. If your Steam wishlist is
                  public, GTS will import it automatically. You can add more
                  titles using the search bar or remove any by hovering on them
                  and clicking the X. Other users will be able to match with you
                  if they own at least one game you're looking for.
                </ContentParagraph>

                {/* Offering */}
                <ContentSubtitle>Offering</ContentSubtitle>
                <ContentParagraph className="mb-16">
                  List the games you've bought that you're willing to share. If
                  your Steam library is public, GTS will import it
                  automatically. You can add or remove games the same way as in
                  the "Looking For" section. Only leave games you are actually
                  willing to share. For information on how Steam Family Sharing
                  works, refer to the related section.
                </ContentParagraph>

                <ImagePlaceholder className="mb-12 mb-16" />

                {/* Verification Step */}
                <ContentSubtitle>Verification Step</ContentSubtitle>
                <ContentParagraph className="mb-8">
                  Before you post, GTS needs to verify that you truly own the
                  Steam account you're linking. There's no registration or Steam
                  login required. Simply place the provided verification code in
                  your Steam profile bio. Once verified, your post will be
                  published.
                </ContentParagraph>

                <ImagePlaceholder />
              </ContentSection>
            </section>

            {/* Frequent Asked Questions */}
            <ContentSection
              id="faq"
              title="Frequent Asked Questions"
              className="mb-8"
            >
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
                answer="Yes, you can share a specific game by flagging all the other games as private. Check the guide here for further information."
              />

              <FAQItem
                question="Can I get banned from Family Sharing?"
                answer="Offline and solo games are 100% safe, but you can get a VAC ban if you're sharing a game with someone who cheats or hacks a multiplayer or online game. We encourage our community to be mindful."
                className="mb-16"
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
                buttonHref="https://donate.stripe.com/test_8x28wQ2qtb5dcZTe6r18c00"
              />
            </section>
          </div>
        </div>
      </MainContentContainer>
      <Footer />
    </Container>
  );
}
