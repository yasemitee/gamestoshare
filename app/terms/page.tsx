import { Container } from '@/components/layout/Container';
import { MainContentContainer } from '@/components/layout/MainContentContainer';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GoBackButton } from '@/components/ui/GoBackButton';
import { ContentSection } from '@/components/content/ContentSection';
import { ContentParagraph } from '@/components/content/ContentParagraph';
import { NumberedList } from '@/components/content/NumberedList';
import { Subsection } from '@/components/content/Subsection';
import { GradientTitle } from '@/components/ui/GradientTitle';
import { PageHeaderMeta } from '@/components/ui/PageHeaderMeta';
import { colors } from '@/lib/colors';
import { getTimeAgo } from '@/lib/utils/time';

// Update this date when Terms & Conditions are modified
const LAST_UPDATED = new Date('2025-11-30');

export default function TermsPage() {
  return (
    <Container>
      <Navbar />
      <MainContentContainer>
        <GoBackButton />
        {/* Header */}
        <div className="mt-14">
          <GradientTitle className="mb-3">Terms & Conditions</GradientTitle>
          <PageHeaderMeta
            lastUpdated={`Last updated: ${getTimeAgo(LAST_UPDATED)}`}
            className="mb-8"
          />

          {/* Introduction */}
          <ContentParagraph>
            These Terms and Conditions govern your access to and use of the
            GamesToShare platform, referred to as "GTS", "the platform", "we",
            "our", and "us". By accessing or using the platform, you agree to be
            bound by these Terms and Conditions. If you do not agree to these
            Terms and Conditions, you must not use GTS.
          </ContentParagraph>
          <ContentParagraph className="mb-16">
            Please read these Terms carefully. This document is intentionally
            detailed to provide full transparency regarding the nature of the
            platform, the usage of Steam data, and the responsibilities of both
            GTS and its users.
          </ContentParagraph>

          {/* Content Sections */}
          <div className="space-y-16">
            {/* 1. Purpose of GTS */}
            <ContentSection title="1. Purpose of GTS">
              <ContentParagraph>
                GTS is a discovery platform that helps users find other Steam
                users who own games they may want to play and who may be looking
                for games the user owns in return. The platform allows users to:
              </ContentParagraph>
              <NumberedList
                items={[
                  'Publish posts listing games they own and games they are interested in.',
                  'Browse posts by other users.',
                  'Verify ownership of a Steam account through publicly available profile information.',
                  'Send links to Steam profiles so that users may send friend requests directly through the Steam platform.',
                ]}
              />
              <ContentParagraph className="">
                GTS does not create, manage, modify, or facilitate the creation
                of Steam Family Sharing groups. Users may decide to communicate
                outside of GTS and use Steam Family Sharing independently. Any
                Steam Family Sharing arrangements occur entirely outside of GTS.
              </ContentParagraph>
            </ContentSection>

            {/* 2. Relationship to Valve Corporation and Steam */}
            <ContentSection title="2. Relationship to Valve Corporation and Steam">
              <ContentParagraph>
                GTS is an independent platform. It is not affiliated with,
                endorsed by, or sponsored by Valve Corporation, Steam, or any
                related entity. Steam is a registered trademark of Valve
                Corporation. Any references to Steam, the Steam platform, the
                Steam Client, or the Steam Subscriber Agreement are for
                informational and compliance purposes only.
              </ContentParagraph>
              <ContentParagraph className="">
                Users of GTS must comply with:
              </ContentParagraph>
              <NumberedList
                items={[
                  'The Steam Subscriber Agreement.',
                  'The Steam Family Sharing policies.',
                  'Any other applicable Steam or Valve Corporation rules, policies, or guidelines.',
                ]}
              />
              <ContentParagraph>
                All data displayed on GTS that originates from Steam is
                retrieved via the public Steam Web API according to the Steam
                Web API Terms of Use.
              </ContentParagraph>
              <ContentParagraph className="">
                GTS does not require Steam login or access to private Steam
                data. GTS does not request or handle Steam credentials.
              </ContentParagraph>
            </ContentSection>

            {/* 3. About Steam Family Sharing and Compliance */}
            <ContentSection title="3. About Steam Family Sharing and Compliance">
              <ContentParagraph>
                Steam Family Sharing is governed entirely by the policies
                established by Valve Corporation. Users should carefully review
                the Steam Subscriber Agreement and all rules concerning Family
                Sharing, including restrictions that specify that Steam Family
                Sharing is intended for family members or trusted users and that
                it may be restricted or revoked by Valve at any time.
              </ContentParagraph>
              <ContentParagraph>
                GTS does not provide Steam Family Sharing functionality. The
                platform only allows users to discover each other based on
                publicly available information and to optionally send a friend
                request through Steam.
              </ContentParagraph>
              <ContentParagraph>
                All actions that could constitute Steam Family Sharing,
                including but not limited to:
              </ContentParagraph>
              <NumberedList
                items={[
                  'Creating a Steam Family Sharing link.',
                  'Granting access to a library.',
                  'Accepting a library share.',
                  'Maintaining a Family library group.',
                ]}
              />
              <ContentParagraph>
                occur entirely outside of GTS and without the involvement of
                GTS.
              </ContentParagraph>
              <ContentParagraph className="">
                Therefore, the use of GTS does not inherently violate the Steam
                Subscriber Agreement, because the platform does not initiate,
                promote, automate, or manage Steam Family Sharing.
              </ContentParagraph>
            </ContentSection>

            {/* 4. Use of the Steam Web API */}
            <ContentSection title="4. Use of the Steam Web API">
              <ContentParagraph>
                All game ownership data, wishlists, and other Steam related
                information shown on GTS is retrieved exclusively through the
                public Steam Web API. By using GTS, you acknowledge and agree
                that:
              </ContentParagraph>
              <NumberedList
                items={[
                  'GTS does not modify any Steam content.',
                  'GTS does not alter Steam data.',
                  'GTS does not collect or store private Steam account information.',
                  'GTS only accesses publicly visible information that any user has opted to make public on Steam.',
                ]}
              />
              <ContentParagraph className="">
                Users understand that making a Steam library or wishlist public
                on Steam is a personal choice and may have privacy implications.
                GTS encourages users to review their Steam privacy settings
                before using the platform.
              </ContentParagraph>
            </ContentSection>

            {/* 5. User Responsibilities */}
            <ContentSection title="5. User Responsibilities">
              <ContentParagraph>
                When using GTS, you agree to the following:
              </ContentParagraph>

              <Subsection number="5.1" title="Accurate Information">
                <ContentParagraph className="mb-6">
                  You agree to provide accurate and truthful information when
                  creating a post. You must not impersonate another person or
                  provide a misleading Steam ID.
                </ContentParagraph>
              </Subsection>

              <Subsection number="5.2" title="Compliance With Steam Policies">
                <ContentParagraph className="mb-6">
                  You agree to comply with the Steam Subscriber Agreement, Steam
                  Family Sharing rules, and all other Steam policies.
                </ContentParagraph>
              </Subsection>

              <Subsection number="5.3" title="External Actions">
                <ContentParagraph className="mb-6">
                  You understand that any decisions to add users on Steam,
                  communicate with them, or create a Steam Family Sharing
                  arrangement are actions you perform outside of GTS and are
                  entirely your responsibility.
                </ContentParagraph>
              </Subsection>

              <Subsection number="5.4" title="Prohibited Use">
                <ContentParagraph>You must not use GTS to:</ContentParagraph>
                <NumberedList
                  items={[
                    'Facilitate harmful, illegal, or abusive behavior.',
                    'Harass, threaten, or exploit other users.',
                    'Automate sending friend requests or perform any action not allowed on Steam.',
                    'Attempt to force or pressure users into Steam Family Sharing.',
                  ]}
                />
                <ContentParagraph className="">
                  GTS reserves the right to suspend or terminate user access for
                  behavior that violates these Terms.
                </ContentParagraph>
              </Subsection>
            </ContentSection>

            {/* 6. Verification Process */}
            <ContentSection title="6. Verification Process">
              <ContentParagraph>
                To maintain trust and reduce fraudulent activity, GTS may ask
                users to verify ownership of a Steam profile by adding a
                temporary verification code to their Steam profile bio.
              </ContentParagraph>
              <ContentParagraph>This verification:</ContentParagraph>
              <NumberedList
                items={[
                  'Does not give GTS any permissions on Steam.',
                  'Does not grant any access to private data.',
                  'Only confirms that the user controls the referenced profile.',
                ]}
              />
              <ContentParagraph className="">
                Users may remove the verification code after their post is
                published.
              </ContentParagraph>
            </ContentSection>

            {/* 7. Intellectual Property and Ownership */}
            <ContentSection title="7. Intellectual Property and Ownership">
              <ContentParagraph>
                GTS does not claim ownership of any content sourced from Steam.
                All Steam related content including but not limited to:
              </ContentParagraph>
              <NumberedList
                items={[
                  'Game titles.',
                  'Game artwork.',
                  'Usernames.',
                  'Public profile information.',
                ]}
              />
              <ContentParagraph>
                belongs to Valve Corporation and the respective rights holders.
              </ContentParagraph>
              <ContentParagraph>
                GTS only displays such information as permitted by the Steam Web
                API Terms of Use.
              </ContentParagraph>
              <ContentParagraph className="">
                All original content on GTS including website design, text, and
                branding is owned by GTS unless otherwise stated.
              </ContentParagraph>
            </ContentSection>

            {/* 8. Liability and Disclaimer */}
            <ContentSection title="8. Liability and Disclaimer">
              <ContentParagraph>
                GTS is provided on an "as is" and "as available" basis. We make
                no warranties or guarantees regarding:
              </ContentParagraph>
              <NumberedList
                items={[
                  'The accuracy of Steam data retrieved from the public API.',
                  'The availability or uptime of the platform.',
                  'The behavior of users on the platform or on Steam.',
                  'The ability of users to form or maintain a Steam Family Sharing arrangement.',
                  'The availability of games in a Steam Family group.',
                  'Any sanctions or limitations Valve Corporation may apply to Steam accounts.',
                ]}
              />
              <ContentParagraph>
                You use GTS entirely at your own risk.
              </ContentParagraph>
              <ContentParagraph className="">
                GTS is not responsible for:
              </ContentParagraph>
              <NumberedList
                items={[
                  'Any disputes between users.',
                  'Any Steam account issues including suspensions or restrictions.',
                  'Any loss of data on Steam.',
                  'Any issues resulting from independent decisions made on the Steam platform outside of GTS.',
                ]}
              />
            </ContentSection>

            {/* 9. Third Party Services */}
            <ContentSection title="9. Third Party Services">
              <ContentParagraph>
                GTS interacts with the Steam Web API, which is operated by Valve
                Corporation. GTS does not control, manage, or guarantee the
                availability or behavior of the Steam Web API.
              </ContentParagraph>
              <ContentParagraph>
                Users are responsible for reviewing Valve Corporation's
                policies, including:
              </ContentParagraph>
              <NumberedList
                items={[
                  'Steam Subscriber Agreement.',
                  'Steam Family Sharing rules.',
                  'Steam Web API Terms of Use.',
                  'Steam Privacy Policy.',
                ]}
              />
              <ContentParagraph className="">
                GTS has no influence over these third party policies.
              </ContentParagraph>
            </ContentSection>

            {/* 10. Privacy Policy Summary */}
            <ContentSection title="10. Privacy Policy Summary">
              <ContentParagraph>
                Although GTS may provide a separate Privacy Policy, this section
                summarizes how data is handled:
              </ContentParagraph>
              <NumberedList
                items={[
                  'GTS does not collect Steam passwords or private account information.',
                  'GTS retrieves only publicly available Steam data.',
                  'Information submitted in posts (like Steam IDs, game lists, locations, and descriptions) is visible to other users.',
                  'No information is sold to third parties.',
                  'User data may be stored for the basic operation of the platform but never shared externally.',
                ]}
              />
            </ContentSection>

            {/* 11. Changes to the Platform */}
            <ContentSection title="11. Changes to the Platform">
              <ContentParagraph>
                GTS may introduce new features, update existing ones, or remove
                parts of the platform at any time. These Terms apply to all
                versions of the service.
              </ContentParagraph>
              <ContentParagraph className="">
                Users will be informed of substantial changes, and continued use
                constitutes acceptance.
              </ContentParagraph>
            </ContentSection>

            {/* 12. Termination */}
            <ContentSection title="12. Termination">
              <ContentParagraph>
                GTS reserves the right to suspend or terminate access if a user:
              </ContentParagraph>
              <NumberedList
                items={[
                  'Violates these Terms.',
                  'Abuses the platform.',
                  'Attempts to misuse Steam Family Sharing.',
                  'Engages in fraudulent or harmful behavior.',
                ]}
              />
              <ContentParagraph className="">
                Users may also request deletion of their posts or data by
                contacting support.
              </ContentParagraph>
            </ContentSection>

            {/* 13. Governing Law */}
            <ContentSection title="13. Governing Law">
              <ContentParagraph className="">
                These Terms and Conditions are governed by the laws of Italy.
                Any disputes arising from the use of GTS will be subject to the
                exclusive jurisdiction of the courts of Milan, Italy.
              </ContentParagraph>
            </ContentSection>

            {/* 14. Contact Information */}
            <ContentSection title="14. Contact Information">
              <ContentParagraph className="mb-4">
                For questions, concerns, or requests regarding these Terms, you
                may contact us at:
              </ContentParagraph>
              <a
                href="https://discord.gg/mavhKaDRCv"
                style={{ color: colors.purple }}
              >
                Discord Server
              </a>
            </ContentSection>

            {/* 15. Final Acknowledgment */}
            <ContentSection title="15. Final Acknowledgment">
              <ContentParagraph>
                By using GTS, you acknowledge that:
              </ContentParagraph>
              <NumberedList
                items={[
                  'GTS is not affiliated with Valve Corporation or Steam.',
                  'GTS operates in compliance with Steam policies by only using public information and by not offering Steam Family Sharing functionality.',
                  'Any Steam Family Sharing you choose to create is done independently outside GTS.',
                  'You understand and accept all responsibilities outlined in these Terms.',
                ]}
              />
              <ContentParagraph className="">
                Your continued use of GTS indicates your full agreement with
                these Terms and Conditions.
              </ContentParagraph>
            </ContentSection>
          </div>
        </div>
      </MainContentContainer>
      <Footer />
    </Container>
  );
}
