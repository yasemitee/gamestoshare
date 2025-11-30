import { Container } from '@/components/layout/Container';
import { MainContentContainer } from '@/components/layout/MainContentContainer';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GoBackButton } from '@/components/ui/GoBackButton';
import { TermsSection } from '@/components/terms/TermsSection';
import { TermsParagraph } from '@/components/terms/TermsParagraph';
import { NumberedList } from '@/components/terms/NumberedList';
import { Subsection } from '@/components/terms/Subsection';
import { colors, gradients } from '@/lib/colors';
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
          <h1
            className="mb-3"
            style={{
              background: gradients.main,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Terms & Conditions
          </h1>
          <p
            className="text-field-small border-b mb-8 pb-3"
            style={{ color: colors.gray1, borderColor: colors.gray2 }}
          >
            Last updated: {getTimeAgo(LAST_UPDATED)}
          </p>

          {/* Introduction */}
          <TermsParagraph>
            These Terms and Conditions govern your access to and use of the
            GamesToShare platform, referred to as "GTS", "the platform", "we",
            "our", and "us". By accessing or using the platform, you agree to be
            bound by these Terms and Conditions. If you do not agree to these
            Terms and Conditions, you must not use GTS.
          </TermsParagraph>
          <TermsParagraph className="mb-16">
            Please read these Terms carefully. This document is intentionally
            detailed to provide full transparency regarding the nature of the
            platform, the usage of Steam data, and the responsibilities of both
            GTS and its users.
          </TermsParagraph>

          {/* Content Sections */}
          <div className="space-y-16">
            {/* 1. Purpose of GTS */}
            <TermsSection title="1. Purpose of GTS">
              <TermsParagraph>
                GTS is a discovery platform that helps users find other Steam
                users who own games they may want to play and who may be looking
                for games the user owns in return. The platform allows users to:
              </TermsParagraph>
              <NumberedList
                items={[
                  'Publish posts listing games they own and games they are interested in.',
                  'Browse posts by other users.',
                  'Verify ownership of a Steam account through publicly available profile information.',
                  'Send links to Steam profiles so that users may send friend requests directly through the Steam platform.',
                ]}
              />
              <TermsParagraph className="">
                GTS does not create, manage, modify, or facilitate the creation
                of Steam Family Sharing groups. Users may decide to communicate
                outside of GTS and use Steam Family Sharing independently. Any
                Steam Family Sharing arrangements occur entirely outside of GTS.
              </TermsParagraph>
            </TermsSection>

            {/* 2. Relationship to Valve Corporation and Steam */}
            <TermsSection title="2. Relationship to Valve Corporation and Steam">
              <TermsParagraph>
                GTS is an independent platform. It is not affiliated with,
                endorsed by, or sponsored by Valve Corporation, Steam, or any
                related entity. Steam is a registered trademark of Valve
                Corporation. Any references to Steam, the Steam platform, the
                Steam Client, or the Steam Subscriber Agreement are for
                informational and compliance purposes only.
              </TermsParagraph>
              <TermsParagraph className="">
                Users of GTS must comply with:
              </TermsParagraph>
              <NumberedList
                items={[
                  'The Steam Subscriber Agreement.',
                  'The Steam Family Sharing policies.',
                  'Any other applicable Steam or Valve Corporation rules, policies, or guidelines.',
                ]}
              />
              <TermsParagraph>
                All data displayed on GTS that originates from Steam is
                retrieved via the public Steam Web API according to the Steam
                Web API Terms of Use.
              </TermsParagraph>
              <TermsParagraph className="">
                GTS does not require Steam login or access to private Steam
                data. GTS does not request or handle Steam credentials.
              </TermsParagraph>
            </TermsSection>

            {/* 3. About Steam Family Sharing and Compliance */}
            <TermsSection title="3. About Steam Family Sharing and Compliance">
              <TermsParagraph>
                Steam Family Sharing is governed entirely by the policies
                established by Valve Corporation. Users should carefully review
                the Steam Subscriber Agreement and all rules concerning Family
                Sharing, including restrictions that specify that Steam Family
                Sharing is intended for family members or trusted users and that
                it may be restricted or revoked by Valve at any time.
              </TermsParagraph>
              <TermsParagraph>
                GTS does not provide Steam Family Sharing functionality. The
                platform only allows users to discover each other based on
                publicly available information and to optionally send a friend
                request through Steam.
              </TermsParagraph>
              <TermsParagraph>
                All actions that could constitute Steam Family Sharing,
                including but not limited to:
              </TermsParagraph>
              <NumberedList
                items={[
                  'Creating a Steam Family Sharing link.',
                  'Granting access to a library.',
                  'Accepting a library share.',
                  'Maintaining a Family library group.',
                ]}
              />
              <TermsParagraph>
                occur entirely outside of GTS and without the involvement of
                GTS.
              </TermsParagraph>
              <TermsParagraph className="">
                Therefore, the use of GTS does not inherently violate the Steam
                Subscriber Agreement, because the platform does not initiate,
                promote, automate, or manage Steam Family Sharing.
              </TermsParagraph>
            </TermsSection>

            {/* 4. Use of the Steam Web API */}
            <TermsSection title="4. Use of the Steam Web API">
              <TermsParagraph>
                All game ownership data, wishlists, and other Steam related
                information shown on GTS is retrieved exclusively through the
                public Steam Web API. By using GTS, you acknowledge and agree
                that:
              </TermsParagraph>
              <NumberedList
                items={[
                  'GTS does not modify any Steam content.',
                  'GTS does not alter Steam data.',
                  'GTS does not collect or store private Steam account information.',
                  'GTS only accesses publicly visible information that any user has opted to make public on Steam.',
                ]}
              />
              <TermsParagraph className="">
                Users understand that making a Steam library or wishlist public
                on Steam is a personal choice and may have privacy implications.
                GTS encourages users to review their Steam privacy settings
                before using the platform.
              </TermsParagraph>
            </TermsSection>

            {/* 5. User Responsibilities */}
            <TermsSection title="5. User Responsibilities">
              <TermsParagraph>
                When using GTS, you agree to the following:
              </TermsParagraph>

              <Subsection number="5.1" title="Accurate Information">
                <TermsParagraph className="mb-6">
                  You agree to provide accurate and truthful information when
                  creating a post. You must not impersonate another person or
                  provide a misleading Steam ID.
                </TermsParagraph>
              </Subsection>

              <Subsection number="5.2" title="Compliance With Steam Policies">
                <TermsParagraph className="mb-6">
                  You agree to comply with the Steam Subscriber Agreement, Steam
                  Family Sharing rules, and all other Steam policies.
                </TermsParagraph>
              </Subsection>

              <Subsection number="5.3" title="External Actions">
                <TermsParagraph className="mb-6">
                  You understand that any decisions to add users on Steam,
                  communicate with them, or create a Steam Family Sharing
                  arrangement are actions you perform outside of GTS and are
                  entirely your responsibility.
                </TermsParagraph>
              </Subsection>

              <Subsection number="5.4" title="Prohibited Use">
                <TermsParagraph>You must not use GTS to:</TermsParagraph>
                <NumberedList
                  items={[
                    'Facilitate harmful, illegal, or abusive behavior.',
                    'Harass, threaten, or exploit other users.',
                    'Automate sending friend requests or perform any action not allowed on Steam.',
                    'Attempt to force or pressure users into Steam Family Sharing.',
                  ]}
                />
                <TermsParagraph className="">
                  GTS reserves the right to suspend or terminate user access for
                  behavior that violates these Terms.
                </TermsParagraph>
              </Subsection>
            </TermsSection>

            {/* 6. Verification Process */}
            <TermsSection title="6. Verification Process">
              <TermsParagraph>
                To maintain trust and reduce fraudulent activity, GTS may ask
                users to verify ownership of a Steam profile by adding a
                temporary verification code to their Steam profile bio.
              </TermsParagraph>
              <TermsParagraph>This verification:</TermsParagraph>
              <NumberedList
                items={[
                  'Does not give GTS any permissions on Steam.',
                  'Does not grant any access to private data.',
                  'Only confirms that the user controls the referenced profile.',
                ]}
              />
              <TermsParagraph className="">
                Users may remove the verification code after their post is
                published.
              </TermsParagraph>
            </TermsSection>

            {/* 7. Intellectual Property and Ownership */}
            <TermsSection title="7. Intellectual Property and Ownership">
              <TermsParagraph>
                GTS does not claim ownership of any content sourced from Steam.
                All Steam related content including but not limited to:
              </TermsParagraph>
              <NumberedList
                items={[
                  'Game titles.',
                  'Game artwork.',
                  'Usernames.',
                  'Public profile information.',
                ]}
              />
              <TermsParagraph>
                belongs to Valve Corporation and the respective rights holders.
              </TermsParagraph>
              <TermsParagraph>
                GTS only displays such information as permitted by the Steam Web
                API Terms of Use.
              </TermsParagraph>
              <TermsParagraph className="">
                All original content on GTS including website design, text, and
                branding is owned by GTS unless otherwise stated.
              </TermsParagraph>
            </TermsSection>

            {/* 8. Liability and Disclaimer */}
            <TermsSection title="8. Liability and Disclaimer">
              <TermsParagraph>
                GTS is provided on an "as is" and "as available" basis. We make
                no warranties or guarantees regarding:
              </TermsParagraph>
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
              <TermsParagraph>
                You use GTS entirely at your own risk.
              </TermsParagraph>
              <TermsParagraph className="">
                GTS is not responsible for:
              </TermsParagraph>
              <NumberedList
                items={[
                  'Any disputes between users.',
                  'Any Steam account issues including suspensions or restrictions.',
                  'Any loss of data on Steam.',
                  'Any issues resulting from independent decisions made on the Steam platform outside of GTS.',
                ]}
              />
            </TermsSection>

            {/* 9. Third Party Services */}
            <TermsSection title="9. Third Party Services">
              <TermsParagraph>
                GTS interacts with the Steam Web API, which is operated by Valve
                Corporation. GTS does not control, manage, or guarantee the
                availability or behavior of the Steam Web API.
              </TermsParagraph>
              <TermsParagraph>
                Users are responsible for reviewing Valve Corporation's
                policies, including:
              </TermsParagraph>
              <NumberedList
                items={[
                  'Steam Subscriber Agreement.',
                  'Steam Family Sharing rules.',
                  'Steam Web API Terms of Use.',
                  'Steam Privacy Policy.',
                ]}
              />
              <TermsParagraph className="">
                GTS has no influence over these third party policies.
              </TermsParagraph>
            </TermsSection>

            {/* 10. Privacy Policy Summary */}
            <TermsSection title="10. Privacy Policy Summary">
              <TermsParagraph>
                Although GTS may provide a separate Privacy Policy, this section
                summarizes how data is handled:
              </TermsParagraph>
              <NumberedList
                items={[
                  'GTS does not collect Steam passwords or private account information.',
                  'GTS retrieves only publicly available Steam data.',
                  'Information submitted in posts (like Steam IDs, game lists, locations, and descriptions) is visible to other users.',
                  'No information is sold to third parties.',
                  'User data may be stored for the basic operation of the platform but never shared externally.',
                ]}
              />
            </TermsSection>

            {/* 11. Changes to the Platform */}
            <TermsSection title="11. Changes to the Platform">
              <TermsParagraph>
                GTS may introduce new features, update existing ones, or remove
                parts of the platform at any time. These Terms apply to all
                versions of the service.
              </TermsParagraph>
              <TermsParagraph className="">
                Users will be informed of substantial changes, and continued use
                constitutes acceptance.
              </TermsParagraph>
            </TermsSection>

            {/* 12. Termination */}
            <TermsSection title="12. Termination">
              <TermsParagraph>
                GTS reserves the right to suspend or terminate access if a user:
              </TermsParagraph>
              <NumberedList
                items={[
                  'Violates these Terms.',
                  'Abuses the platform.',
                  'Attempts to misuse Steam Family Sharing.',
                  'Engages in fraudulent or harmful behavior.',
                ]}
              />
              <TermsParagraph className="">
                Users may also request deletion of their posts or data by
                contacting support.
              </TermsParagraph>
            </TermsSection>

            {/* 13. Governing Law */}
            <TermsSection title="13. Governing Law">
              <TermsParagraph className="">
                These Terms and Conditions are governed by the applicable laws
                of [Insert Jurisdiction]. Any disputes arising from the use of
                GTS will be handled in the courts of the same jurisdiction
                unless otherwise required by law.
              </TermsParagraph>
            </TermsSection>

            {/* 14. Contact Information */}
            <TermsSection title="14. Contact Information">
              <TermsParagraph className="mb-4">
                For questions, concerns, or requests regarding these Terms, you
                may contact us at:
              </TermsParagraph>
              <a href="todo" style={{ color: colors.purple }}>
                Discord Server
              </a>
            </TermsSection>

            {/* 15. Final Acknowledgment */}
            <TermsSection title="15. Final Acknowledgment">
              <TermsParagraph>
                By using GTS, you acknowledge that:
              </TermsParagraph>
              <NumberedList
                items={[
                  'GTS is not affiliated with Valve Corporation or Steam.',
                  'GTS operates in compliance with Steam policies by only using public information and by not offering Steam Family Sharing functionality.',
                  'Any Steam Family Sharing you choose to create is done independently outside GTS.',
                  'You understand and accept all responsibilities outlined in these Terms.',
                ]}
              />
              <TermsParagraph className="">
                Your continued use of GTS indicates your full agreement with
                these Terms and Conditions.
              </TermsParagraph>
            </TermsSection>
          </div>
        </div>
      </MainContentContainer>
      <Footer />
    </Container>
  );
}
