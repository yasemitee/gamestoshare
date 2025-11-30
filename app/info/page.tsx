import { Container } from '@/components/layout/Container';
import { MainContentContainer } from '@/components/layout/MainContentContainer';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GoBackButton } from '@/components/ui/GoBackButton';
import { colors, gradients } from '@/lib/colors';
import { ActionButtons } from '@/components/listings/ActionButtons';
import { Divider } from '@/components/ui/Divider';
import { Button } from '@/components/ui/Button';

export default function InfoPage() {
  return (
    <Container>
      <Navbar />
      <MainContentContainer>
        <GoBackButton />
        {/* Header */}
        <div className="mt-14">
          <h1
            className="mb-3"
            style={{
              background: gradients.main,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Guide: How to use GTS
          </h1>
          <div
            className="flex items-center gap-9 mb-13 border-b pb-4"
            style={{ borderColor: colors.gray2 }}
          >
            <span className="text-field-small" style={{ color: colors.gray1 }}>
              Updated Nov 30, 2025
            </span>
            <div className="flex items-center gap-2">
              <span
                className="text-field-small"
                style={{ color: colors.gray1 }}
              >
                •
              </span>
              <span
                className="text-field-small"
                style={{ color: colors.gray1 }}
              >
                3 min read
              </span>
            </div>
            <div className="ml-auto">
              <ActionButtons showReport={false} showShare={true} />
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="mb-16">
            <p
              className="text-small-title mb-6"
              style={{ color: colors.white }}
            >
              QUICK NAVIGATION
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#what-is-gts"
                className="text-small-title hover:opacity-80 transition-opacity"
                style={{ color: colors.purple }}
              >
                WHAT IS GTS
              </a>
              <a
                href="#how-does-it-work"
                className="text-small-title hover:opacity-80 transition-opacity"
                style={{ color: colors.purple }}
              >
                HOW DOES IT WORK?
              </a>
              <a
                href="#how-to-use"
                className="text-small-title hover:opacity-80 transition-opacity"
                style={{ color: colors.purple }}
              >
                HOW TO USE THIS PLATFORM
              </a>
              <a
                href="#faq"
                className="text-small-title hover:opacity-80 transition-opacity"
                style={{ color: colors.purple }}
              >
                FAQ
              </a>
              <a
                href="#support"
                className="text-small-title hover:opacity-80 transition-opacity"
                style={{ color: colors.purple }}
              >
                SUPPORT
              </a>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-16">
            {/* What is GamesToShare */}
            <section>
              <p className="text-title mb-6" style={{ color: colors.white }}>
                What is GamesToShare?
              </p>
              <p
                className="text-field-small leading-relaxed"
                style={{ color: colors.gray1 }}
              >
                GamesToShare is a platform where Steam users share access to
                games through their Steam accounts. Anyone with a Steam account
                can use it, and it's free to play. Users share their own
                libraries with others by sending friend requests on Steam.
              </p>
            </section>

            {/* Who is it for */}
            <section id="who-is-it-for">
              <p className="text-title mb-6" style={{ color: colors.white }}>
                Who is it for?
              </p>
              <p
                className="text-field-small leading-relaxed mb-4"
                style={{ color: colors.gray1 }}
              >
                GTS is designed for people who want access to try new games
                without buying them right away.
              </p>
              <p
                className="text-field-small leading-relaxed"
                style={{ color: colors.gray1 }}
              >
                By trading, two users create a Steam Family and share access to
                each other's libraries, creating a balanced exchange.
              </p>
            </section>

            <Divider />

            {/* Browsing Offers */}
            <section id="how-does-it-work">
              <section id="browsing-offers">
                <p className="text-title mb-6" style={{ color: colors.white }}>
                  Browsing Offers
                </p>
                <p
                  className="text-field-small leading-relaxed mb-4"
                  style={{ color: colors.gray1 }}
                >
                  You can explore existing posts or create your own.
                </p>
                <ol
                  className="list-decimal list-inside space-y-3 text-field-small"
                  style={{ color: colors.gray1 }}
                >
                  <li>
                    Use the search bar on the homepage or the dedicated search
                    page to look up specific games or sort offers by date.
                  </li>
                  <li>Click on a post to open it.</li>
                  <li>
                    If you're interested, you can send a Steam friend request
                    directly from the post.
                  </li>
                </ol>
                <p
                  className="text-field-small leading-relaxed mt-4"
                  style={{ color: colors.gray1 }}
                >
                  Additionally you can use the location filter to find friends
                  close to you.
                </p>

                {/* Placeholder Image */}
                <div
                  className="mt-8 w-full h-64 flex items-center justify-center mb-16"
                  style={{ backgroundColor: colors.gray3 }}
                >
                  <span className="text-field" style={{ color: colors.gray1 }}>
                    Image placeholder
                  </span>
                </div>
              </section>
              {/* Sending a Request */}
              <section id="sending-request">
                <p className="text-title mb-6" style={{ color: colors.white }}>
                  Sending a Request
                </p>
                <p
                  className="text-field-small leading-relaxed mb-4"
                  style={{ color: colors.gray1 }}
                >
                  Before you can send a request, the platform will check if
                  you're able to trade.
                </p>
                <p
                  className="text-field-small leading-relaxed mb-4"
                  style={{ color: colors.gray1 }}
                >
                  Your account must own at least one game that appears in the
                  "Looking for" section of the post you're viewing.
                </p>
                <p
                  className="text-field-small leading-relaxed mb-4"
                  style={{ color: colors.gray1 }}
                >
                  Enter your Steam ID and wait for confirmation. If there's a
                  match, you'll be able to send a friend request or open the
                  user's Steam profile directly.
                </p>

                {/* Placeholder Image */}
                <div
                  className="mt-8 w-full h-64 flex items-center justify-center mb-16"
                  style={{ backgroundColor: colors.gray3 }}
                >
                  <span className="text-field" style={{ color: colors.gray1 }}>
                    Image placeholder
                  </span>
                </div>
              </section>
            </section>
            <section id="how-to-use">
              {/* Creating a Post */}
              <section id="creating-post">
                <p className="text-title mb-4" style={{ color: colors.white }}>
                  Creating a Post
                </p>
                <p
                  className="text-field-small leading-relaxed mb-8"
                  style={{ color: colors.gray1 }}
                >
                  To publish an offer, click the post button on the right side
                  of the navigation bar. You'll be asked to fill in a few
                  details.
                </p>

                {/* Steam ID */}
                <p className="text-field mb-4" style={{ color: colors.purple }}>
                  Steam ID
                </p>
                <p
                  className="text-field leading-relaxed"
                  style={{ color: colors.gray1 }}
                >
                  This is the link displayed at the top of your Steam profile,
                  for example:
                </p>
                <p
                  className="text-field leading-relaxed my-6 inline-block"
                  style={{
                    color: colors.gray1,
                    backgroundColor: `${colors.black}40`,
                    padding: '8px',
                  }}
                >
                  https://steamcommunity.com/profiles/76561199382517992
                </p>
                <p
                  className="text-field leading-relaxed mb-8"
                  style={{ color: colors.gray1 }}
                >
                  You can choose whether to show your Steam username in the
                  post. If you leave the checkbox unticked, your name will
                  appear as "Anonymous".
                </p>

                {/* Location */}
                <p className="text-field mb-4" style={{ color: colors.purple }}>
                  Location
                </p>
                <p
                  className="text-field leading-relaxed mb-8"
                  style={{ color: colors.gray1 }}
                >
                  Choose the location of your Steam store region. A Steam Family
                  can only be created between accounts in the same store region,
                  so this is important. If your location is already set on your
                  profile, it will be retrieved automatically. Otherwise, you
                  will have to select a location.
                </p>

                {/* Platform */}
                <p className="text-field mb-4" style={{ color: colors.purple }}>
                  Platform
                </p>
                <p
                  className="text-field leading-relaxed mb-8"
                  style={{ color: colors.gray1 }}
                >
                  The platform is currently GTS only supports Steam for sharing.
                  Additional platforms for consoles and PC are planned for
                  future updates.
                </p>

                {/* Description */}
                <p className="text-field mb-4" style={{ color: colors.purple }}>
                  Description
                </p>
                <p
                  className="text-field leading-relaxed mb-8"
                  style={{ color: colors.gray1 }}
                >
                  Use this space to add helpful details about your trade. You
                  can mention your usual gaming hours, games you are currently
                  playing and not willing to trade, or preferred ways to be
                  contacted.
                </p>

                {/* Looking For */}
                <p className="text-field mb-4" style={{ color: colors.purple }}>
                  Looking For
                </p>
                <p
                  className="text-field leading-relaxed mb-8"
                  style={{ color: colors.gray1 }}
                >
                  Add the games you'd like to play. If your Steam wishlist is
                  public, GTS will import it automatically. You can add more
                  titles using the search bar or remove any by hovering on them
                  and clicking the X. Other users will be able to match with you
                  if they own at least one game you're looking for.
                </p>

                {/* Offering */}
                <p className="text-field mb-4" style={{ color: colors.purple }}>
                  Offering
                </p>
                <p
                  className="text-field leading-relaxed mb-16"
                  style={{ color: colors.gray1 }}
                >
                  List the games you've bought that you're willing to share. If
                  your Steam library is public, GTS will import it
                  automatically. You can add or remove games the same way as in
                  the "Looking For" section. Only leave games you are actually
                  willing to share. For information on how Steam Family Sharing
                  works, refer to the related section.
                </p>

                {/* Placeholder Image */}
                <div
                  className="mb-12 w-full h-64 flex items-center justify-center mb-16"
                  style={{ backgroundColor: colors.gray3 }}
                >
                  <span className="text-field" style={{ color: colors.gray1 }}>
                    Image placeholder
                  </span>
                </div>

                {/* Verification Step */}
                <p className="text-field mb-4" style={{ color: colors.purple }}>
                  Verification Step
                </p>
                <p
                  className="text-field leading-relaxed mb-8"
                  style={{ color: colors.gray1 }}
                >
                  Before you post, GTS needs to verify that you truly own the
                  Steam account you're linking. There's no registration or Steam
                  login required. Simply place the provided verification code in
                  your Steam profile bio. Once verified, your post will be
                  published.
                </p>

                {/* Placeholder Image */}
                <div
                  className="w-full h-64 flex items-center justify-center mb-16"
                  style={{ backgroundColor: colors.gray3 }}
                >
                  <span className="text-field" style={{ color: colors.gray1 }}>
                    Image placeholder
                  </span>
                </div>
              </section>
            </section>

            {/* Frequent Asked Questions */}
            <section id="faq">
              <p className="text-title mb-8" style={{ color: colors.white }}>
                Frequent Asked Questions
              </p>

              <p className="text-field mb-4" style={{ color: colors.purple }}>
                How do I enable Family Sharing?
              </p>
              <p
                className="text-field leading-relaxed mb-8"
                style={{ color: colors.gray1 }}
              >
                Log into Steam &gt; Settings &gt; Family &gt; Authorize Library
                Sharing on this device.
              </p>

              <p className="text-field mb-4" style={{ color: colors.purple }}>
                How can I add people to my Steam Family?
              </p>
              <p
                className="text-field leading-relaxed mb-8"
                style={{ color: colors.gray1 }}
              >
                You need to be friends first. You will see the eligible accounts
                under Settings &gt; Family.
              </p>

              <p className="text-field mb-4" style={{ color: colors.purple }}>
                Is there a limit to the number of accounts I can share my
                Library with?
              </p>
              <p
                className="text-field leading-relaxed mb-8"
                style={{ color: colors.gray1 }}
              >
                Yes, a Family Library can be shared with up to 5 accounts and up
                to 10 devices in 90 days.
              </p>

              <p className="text-field mb-4" style={{ color: colors.purple }}>
                Can I share a specific game?
              </p>
              <p
                className="text-field leading-relaxed mb-8"
                style={{ color: colors.gray1 }}
              >
                Yes, you can share a specific game by flagging all the other
                games as private. Check the guide here for further information.
              </p>

              <p className="text-field mb-4" style={{ color: colors.purple }}>
                Can I get banned from Family Sharing?
              </p>
              <p
                className="text-field leading-relaxed mb-16"
                style={{ color: colors.gray1 }}
              >
                Offline and solo games are 100% safe, but you can get a VAC ban
                if you're sharing a game with someone who cheats or hacks a
                multiplayer or online game. We encourage our community to be
                mindful.
              </p>
            </section>

            {/* We support you & You support us */}
            <section
              id="support"
              className="grid grid-cols-1 md:grid-cols-2 gap-28"
            >
              <div>
                <p className="text-title mb-8" style={{ color: colors.white }}>
                  We support you
                </p>
                <p
                  className="text-field leading-relaxed mb-4"
                  style={{ color: colors.gray1 }}
                >
                  If you're still having trouble, you can contact the staff on
                  the Discord Server.
                </p>
                <p
                  className="text-field leading-relaxed mb-8"
                  style={{ color: colors.gray1 }}
                >
                  Write a message in the "Help" text channel, where other users
                  and our team can message back and help you out.
                </p>
                <Button className="inline-flex items-center gap-1.5 text-button">
                  <img
                    src="/Discord.svg"
                    alt="Discord"
                    width={16}
                    height={16}
                  />
                  <span className="text-button">JOIN OUR SERVER</span>
                </Button>
              </div>

              <div>
                <p className="text-title mb-8" style={{ color: colors.white }}>
                  You support us
                </p>
                <p
                  className="text-field leading-relaxed mb-4"
                  style={{ color: colors.gray1 }}
                >
                  Please consider tipping or donating to help us maintain the
                  platform and provide assistance to users.
                </p>
                <p
                  className="text-field leading-relaxed mb-8"
                  style={{ color: colors.gray1 }}
                >
                  Donors will get the "Donor" tag on the platform and on the
                  Discord Server.
                </p>
                <Button
                  className="inline-flex items-center gap-1.5 text-button"
                  style={{
                    background: gradients.pink,
                  }}
                >
                  <img src="/Heart.svg" alt="Heart" width={16} height={16} />
                  <span className="text-button">DONATE</span>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </MainContentContainer>
      <Footer />
    </Container>
  );
}
