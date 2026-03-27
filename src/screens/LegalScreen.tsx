/**
 * Funkytown Fit — Legal Screen
 * Modal-style screen for Privacy Policy, Terms of Service, and Health Disclaimer.
 * Required for App Store (Apple) and Play Store (Google) submissions.
 *
 * Usage:
 *   <LegalScreen doc="privacy" onClose={() => setVisible(false)} />
 *   <LegalScreen doc="terms"   onClose={...} />
 *   <LegalScreen doc="health"  onClose={...} />
 */

import React, { useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '@/theme';

export type LegalDoc = 'privacy' | 'terms' | 'health';

interface Props {
  doc: LegalDoc;
  onClose: () => void;
}

// ─── Content ─────────────────────────────────────────────────────────────────
// NOTE: Replace these placeholders with your attorney-reviewed content before
// App Store submission. Update the "Last updated" dates when you do so.

const CONTENT: Record<LegalDoc, { title: string; sections: { heading: string; body: string }[] }> = {

  privacy: {
    title: 'Privacy Policy',
    sections: [
      {
        heading: 'Last Updated: January 1, 2025',
        body: 'Funkytown Fit ("we," "us," or "our") operates the Funkytown Fit mobile application. This Privacy Policy describes how we collect, use, and share information about you when you use our app.',
      },
      {
        heading: 'Information We Collect',
        body: 'We collect information you provide directly, including your name, email address, and health/fitness data such as weight, calorie logs, and workout history. We also collect usage data automatically, including device identifiers and app usage statistics.',
      },
      {
        heading: 'Health & Fitness Data',
        body: 'With your permission, we may access health data through Apple HealthKit or Google Fit. This data is used solely to provide app features. We do not sell health data to third parties, and health data is not used for advertising purposes.',
      },
      {
        heading: 'How We Use Your Information',
        body: 'We use your information to provide and improve the app, personalize your fitness experience, send notifications you request, and comply with legal obligations. We do not sell your personal information to third parties.',
      },
      {
        heading: 'Data Storage & Security',
        body: 'Your data is stored securely using Supabase\'s infrastructure, which is hosted on AWS. We use industry-standard encryption for data in transit and at rest. While we take reasonable precautions, no system is completely secure.',
      },
      {
        heading: 'Data Retention & Deletion',
        body: 'You may delete your account at any time from the Profile screen. Upon deletion, we will remove your personal information and health data from our systems within 30 days, except where retention is required by law.',
      },
      {
        heading: 'Third-Party Services',
        body: 'The app uses Supabase (database), Anthropic (AI coaching), Spotify (music integration), and Google Places (location features). Each has its own privacy policy. We encourage you to review them.',
      },
      {
        heading: 'Children\'s Privacy',
        body: 'Funkytown Fit is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us information, please contact us.',
      },
      {
        heading: 'Changes to This Policy',
        body: 'We may update this policy periodically. We will notify you of significant changes through the app or by email. Continued use after changes constitutes acceptance of the updated policy.',
      },
      {
        heading: 'Contact Us',
        body: 'Questions about this policy? Email us at privacy@funkytownfit.com or visit funkytownfit.com/privacy.',
      },
    ],
  },

  terms: {
    title: 'Terms of Service',
    sections: [
      {
        heading: 'Last Updated: January 1, 2025',
        body: 'These Terms of Service ("Terms") govern your use of the Funkytown Fit mobile application. By using the app you agree to these Terms. If you disagree, do not use the app.',
      },
      {
        heading: 'Eligibility',
        body: 'You must be at least 13 years old to use Funkytown Fit. By using the app you represent that you are at least 13 and that you have the legal capacity to agree to these Terms.',
      },
      {
        heading: 'User Account',
        body: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized account access. You are responsible for all activity that occurs under your account.',
      },
      {
        heading: 'Acceptable Use',
        body: 'You agree not to: use the app for unlawful purposes; post content that is harmful, offensive, or violates others\' rights; attempt to access systems or data not intended for you; or interfere with the app\'s operation.',
      },
      {
        heading: 'Health Disclaimer',
        body: 'Funkytown Fit provides fitness and nutrition information for general wellness purposes only. It is NOT medical advice. Always consult a qualified healthcare provider before starting any new exercise or diet program, especially if you have a medical condition.',
      },
      {
        heading: 'User Content',
        body: 'You retain ownership of content you create and share. By posting content, you grant us a non-exclusive license to display it within the app. You are responsible for ensuring your content does not violate any third-party rights.',
      },
      {
        heading: 'Intellectual Property',
        body: 'All app content, features, and functionality are owned by Funkytown Fit or its licensors and protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without permission.',
      },
      {
        heading: 'Disclaimer of Warranties',
        body: 'The app is provided "as is" without warranties of any kind. We do not warrant that the app will be error-free or uninterrupted, that results will be accurate, or that defects will be corrected.',
      },
      {
        heading: 'Limitation of Liability',
        body: 'To the fullest extent permitted by law, Funkytown Fit shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the app, including any fitness injuries or health outcomes.',
      },
      {
        heading: 'Termination',
        body: 'We may suspend or terminate your access to the app at our discretion, with or without cause. You may terminate your account at any time from the Profile screen.',
      },
      {
        heading: 'Governing Law',
        body: 'These Terms are governed by the laws of the State of Texas, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Tarrant County, Texas.',
      },
      {
        heading: 'Contact',
        body: 'Questions? Email legal@funkytownfit.com or visit funkytownfit.com/terms.',
      },
    ],
  },

  health: {
    title: 'Health Disclaimer',
    sections: [
      {
        heading: '⚠️ Important — Read Before Using',
        body: 'Funkytown Fit is a wellness and fitness tracking application. The information, recommendations, and AI-generated content in this app are provided for general informational and motivational purposes only.',
      },
      {
        heading: 'Not Medical Advice',
        body: 'Nothing in this app constitutes medical advice, diagnosis, or treatment. The calorie targets, workout programs, nutrition guidance, and AI coaching are NOT substitutes for professional medical advice. Always consult a licensed physician or qualified healthcare provider before beginning any new diet or exercise program.',
      },
      {
        heading: 'Consult Your Doctor First',
        body: 'Before using this app, consult your doctor if you: have a chronic medical condition (heart disease, diabetes, hypertension, etc.); are pregnant or nursing; have had recent surgery or injury; experience chest pain, dizziness, or shortness of breath during exercise; or have been inactive for an extended period.',
      },
      {
        heading: 'Calorie & Nutrition Targets',
        body: 'Calorie and macro targets in this app are estimates based on general formulas (like TDEE calculations). Actual needs vary significantly by individual. Extremely low-calorie diets can be dangerous. Do not reduce calories to unhealthy levels without medical supervision.',
      },
      {
        heading: 'Exercise Safety',
        body: 'Stop exercising immediately and seek medical attention if you experience chest pain, severe shortness of breath, dizziness, fainting, or pain that feels abnormal. Start new programs gradually. Proper form matters more than weight or speed.',
      },
      {
        heading: 'AI-Generated Coaching',
        body: 'The Habit Lab articles and AI coaching responses are generated by artificial intelligence and are not reviewed by licensed medical or fitness professionals. They are intended as general motivation and education only.',
      },
      {
        heading: 'Food Logging Accuracy',
        body: 'Nutritional information in our food database comes from various sources and may contain errors. We cannot guarantee the accuracy of all nutritional data. Users with specific dietary medical requirements should verify information independently.',
      },
      {
        heading: 'Health Data Integration',
        body: 'Apple HealthKit and fitness tracker integrations provide data for reference only. This data should not be used to make medical decisions. Heart rate, calorie burn, and other biometric estimates from consumer devices are approximations.',
      },
      {
        heading: 'Mental Health',
        body: 'Fitness apps can sometimes contribute to unhealthy relationships with food, exercise, or body image. If you find yourself experiencing anxiety around calorie counting or exercise, please reach out to a mental health professional. Your wellbeing matters more than any number.',
      },
      {
        heading: 'Assumption of Risk',
        body: 'Physical exercise involves inherent risk of injury. By using Funkytown Fit, you acknowledge that you assume responsibility for your own health and safety during workouts. Funkytown Fit is not responsible for injuries sustained during exercise.',
      },
      {
        heading: 'Emergency',
        body: 'If you are experiencing a medical emergency, call 911 immediately. Do not rely on this app in an emergency situation.',
      },
    ],
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function LegalScreen({ doc, onClose }: Props) {
  const { title, sections } = CONTENT[doc];
  const scrollRef = useRef<ScrollView>(null);

  const accentColor = doc === 'health' ? colors.red : colors.orange;

  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {sections.map((section, i) => (
            <View key={i} style={styles.section}>
              <Text style={[styles.sectionHeading, i === 0 && { color: colors.textMuted }]}>
                {section.heading}
              </Text>
              <Text style={styles.sectionBody}>{section.body}</Text>
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Funkytown Fit · Fort Worth, TX</Text>
            <Text style={styles.footerText}>funkytownfit.com</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.cardElevated,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  sectionBody: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  footerText: {
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
});
