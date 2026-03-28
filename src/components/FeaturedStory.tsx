/**
 * Funkytown Fit — Featured Story Component
 *
 * Renders a pinned editorial card in the Community feed.
 * Opens a full-screen modal with the complete story when tapped.
 *
 * First story: "5 Great Friday Happy Hour Spots in Fort Worth"
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView,
  Image, SafeAreaView, Linking, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '@/theme';

// ─── Story data ───────────────────────────────────────────────────────────────

interface SpotImage {
  uri: string;
  credit: string;
}

interface HappyHourSpot {
  rank: number;
  name: string;
  neighborhood: string;
  address: string;
  happyHourDays: string;
  happyHourTimes: string;
  vibe: string;
  description: string;
  mustOrder: string;
  tip: string;
  image: SpotImage;
  mapsUrl: string;
}

const SPOTS: HappyHourSpot[] = [
  {
    rank: 1,
    name: "Eddie V's Prime Seafood",
    neighborhood: "West 7th",
    address: "3100 W 7th St, Fort Worth, TX 76107",
    happyHourDays: "Monday – Friday",
    happyHourTimes: "4:00 PM – 7:30 PM",
    vibe: "Upscale · Live Music · Power Hour",
    description:
      "Eddie V's sets the gold standard for Fort Worth happy hours. Settle into the V Lounge — a sleek, dimly lit bar space with live music trios performing nightly — and order from a happy hour menu that punches well above its price tag. We're talking fresh oysters, chilled shrimp, and crab-stuffed mushrooms alongside perfectly crafted cocktails at bar-program prices. The crowd here is a mix of West 7th regulars, after-work professionals, and date-night couples who know that the lounge is one of the best-kept deals in town. Skip the dining room reservation and plant yourself at the bar for what might be the most satisfying couple of hours in Fort Worth.",
    mustOrder: "Chilled Jumbo Shrimp + Large Blue Margarita",
    tip: "Get there right at 4 PM on a Thursday — the bar fills up fast and the live trio usually starts around 6:30.",
    image: {
      uri: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85",
      credit: "Photo representative of Eddie V's ambiance",
    },
    mapsUrl: "https://maps.apple.com/?address=3100+W+7th+St,+Fort+Worth,+TX+76107",
  },
  {
    rank: 2,
    name: "Henry McCarty Irish Pub",
    neighborhood: "Cultural District",
    address: "2869 Crockett St, Fort Worth, TX 76107",
    happyHourDays: "Tuesday – Friday",
    happyHourTimes: "4:00 PM – 7:00 PM",
    vibe: "Neighborhood Pub · Authentic Irish · Laid-Back Energy",
    description:
      "Named after the notorious Billy the Kid — whose real name was William Henry McCarty — this brand-new Crockett Street gem brings genuine Irish pub culture to Fort Worth's Cultural District. The space feels like it was teleported brick-by-brick from Dublin: dark wood, warm amber lighting, and Guinness poured properly (flat-top, not tilted). The happy hour menu leans into Irish pub classics: Irish mules with a local ginger beer twist, Irishman Red on draft, and a whiskey selection that would make any Irish grandmother proud. The kitchen turns out elevated pub food — shepherd's pie, bangers, smoked salmon toasts — that pairs perfectly with a pint. This is the kind of place you stop for one drink and end up staying for three.",
    mustOrder: "Properly poured Guinness Stout + Shepherd's Pie",
    tip: "Wednesday nights bring live traditional Irish music starting at 7 PM — perfectly timed to ride out of happy hour into a full evening.",
    image: {
      uri: "https://images.unsplash.com/photo-1585779034823-7e9ac0faddd7?w=800&q=85",
      credit: "Photo representative of Henry McCarty Irish Pub",
    },
    mapsUrl: "https://maps.apple.com/?address=2869+Crockett+St,+Fort+Worth,+TX+76107",
  },
  {
    rank: 3,
    name: "Branch & Bird",
    neighborhood: "Downtown (Frost Tower)",
    address: "640 Taylor St, Suite 1200, Fort Worth, TX 76102",
    happyHourDays: "Tuesday – Friday",
    happyHourTimes: "4:00 PM – 6:00 PM",
    vibe: "Sky-High Views · Craft Cocktails · Rooftop Patio",
    description:
      "Branch & Bird sits on the Sky Lobby level of Frost Tower, and the view alone earns its spot on this list. The outdoor patio gives you an unobstructed panoramic of downtown Fort Worth — the skyline, the Cultural District in the distance, and golden hour light that makes every cocktail look like it belongs in a magazine. The food program is the most thoughtful on this list: all ingredients are sourced from small Texas artisan farmers and ranchers, and you'll taste the difference. Happy hour brings $6 premium cocktails and $10 flatbreads — genuinely some of the best value in town for the quality and setting. On Wednesdays, half-priced bottles of wine plus live music run all night, making it the city's best midweek reset.",
    mustOrder: "Seasonal Craft Cocktail + Wood-Fired Flatbread",
    tip: "Stake out a patio table before 4:30 on clear afternoons — the downtown sunset view from up there is unmatched in Fort Worth.",
    image: {
      uri: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=85",
      credit: "Photo representative of Branch & Bird rooftop bar",
    },
    mapsUrl: "https://maps.apple.com/?address=640+Taylor+St,+Fort+Worth,+TX+76102",
  },
  {
    rank: 4,
    name: "HG Sply Co.",
    neighborhood: "West 7th / Trinity River",
    address: "1621 River Run, Suite 176, Fort Worth, TX 76107",
    happyHourDays: "Monday – Friday",
    happyHourTimes: "3:00 PM – 6:00 PM",
    vibe: "Riverside Patio · Health-Forward · Dog-Friendly",
    description:
      "HG Sply Co. proves that health-conscious eating doesn't have to mean skipping happy hour. Perched above the Trinity River with one of the best covered patios in the city, this is the spot for the health-minded crowd that still likes to unwind right. The happy hour deal is generous: half-priced specialty cocktails and appetizers, $4 draft beers, and $7 select wines every weekday. The menu walks the line between indulgent and nutritious — think buffalo cauliflower bites, tuna tacos, and avocado deviled eggs. Bring your dog on Tuesdays and you get an extra hour of happy hour. On a warm Friday afternoon with a cold drink and a river view, this place genuinely doesn't get better.",
    mustOrder: "Half-price specialty cocktail + Tuna Tacos",
    tip: "Tuesday dog-happy-hour extends deals until 7 PM. It's the most Fort Worth thing possible: health food, craft drinks, and your dog on a river patio.",
    image: {
      uri: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=85",
      credit: "Photo representative of HG Sply Co. patio",
    },
    mapsUrl: "https://maps.apple.com/?address=1621+River+Run,+Fort+Worth,+TX+76107",
  },
  {
    rank: 5,
    name: "Tinies",
    neighborhood: "Near Southside / Main St",
    address: "113 S Main St, Fort Worth, TX 76104",
    happyHourDays: "Tuesday – Friday",
    happyHourTimes: "4:00 PM – 6:00 PM",
    vibe: "Mezcal Hall · Mexican Craft Cocktails · Intimate",
    description:
      "Tinies is the hidden gem of Fort Worth happy hours — a fine Mexican cuisine and mezcal hall on Main Street that the city hasn't fully discovered yet, which means you should go now. The space is intimate, warmly lit, and designed around a serious agave spirits program. Their cocktail bar features skilled mixologists who treat mezcal and tequila with the same reverence a sommelier gives to wine — every pour is intentional. Happy hour brings $8 Casita Margaritas, $4 Modelos, and $5 chips and queso, making it the most affordable quality entry on this list. The rotisserie chicken and small plates are incredible, and the Pera Picante cocktail (pear, jalapeño, mezcal) is something you'll think about for days afterward.",
    mustOrder: "Casita Margarita + Pera Picante + Chips & Queso",
    tip: "This place is legitimately underrated right now — the mezcal flight during happy hour price is a steal. Go before the secret gets out.",
    image: {
      uri: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=85",
      credit: "Photo representative of Tinies cocktail bar",
    },
    mapsUrl: "https://maps.apple.com/?address=113+S+Main+St,+Fort+Worth,+TX+76104",
  },
];

// Hero image for Branch & Bird (the title card)
const HERO_IMAGE = "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&q=90";

// ─── Featured Story Card (shows in feed) ─────────────────────────────────────

export default function FeaturedStory() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={st.card}
        onPress={() => setModalOpen(true)}
        activeOpacity={0.88}
      >
        {/* Hero image */}
        <View style={st.imageWrap}>
          <Image source={{ uri: HERO_IMAGE }} style={st.heroImage} resizeMode="cover" />
          <View style={st.imageOverlay} />
          {/* "FEATURED" badge */}
          <View style={st.featuredBadge}>
            <Text style={st.featuredBadgeText}>FEATURED</Text>
          </View>
        </View>

        {/* Card body */}
        <View style={st.cardBody}>
          <Text style={st.category}>HAPPY HOUR · FORT WORTH</Text>
          <Text style={st.title}>5 Great Friday Happy Hour Spots in Fort Worth</Text>
          <Text style={st.teaser}>
            The city's best drinks deals — from a rooftop downtown to a riverside patio and a hidden mezcal hall.
          </Text>
          <View style={st.footer}>
            <View style={st.authorRow}>
              <View style={st.authorDot} />
              <Text style={st.authorText}>Funkytown Fit Editorial</Text>
            </View>
            <View style={st.readMoreRow}>
              <Text style={st.readMoreText}>Read</Text>
              <Ionicons name="arrow-forward" size={12} color={colors.orange} />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Full story modal */}
      <StoryModal visible={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

// ─── Story Modal ──────────────────────────────────────────────────────────────

function StoryModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [activeSpot, setActiveSpot] = useState<HappyHourSpot | null>(null);

  function openMaps(spot: HappyHourSpot) {
    Linking.openURL(spot.mapsUrl).catch(() => {
      Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(spot.address)}`);
    });
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={m.root}>

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <View style={m.header}>
          <Text style={m.headerCategory}>HAPPY HOUR · FORT WORTH</Text>
          <TouchableOpacity style={m.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={m.scroll}>

          {/* ── Hero image ───────────────────────────────────────────────────── */}
          <View style={m.heroWrap}>
            <Image source={{ uri: HERO_IMAGE }} style={m.heroImg} resizeMode="cover" />
            <View style={m.heroOverlay} />
            <View style={m.heroTextBlock}>
              <Text style={m.heroTitle}>5 Great Friday Happy Hour Spots in Fort Worth</Text>
              <Text style={m.heroSub}>Funkytown Fit Editorial</Text>
            </View>
          </View>

          {/* ── Intro ────────────────────────────────────────────────────────── */}
          <View style={m.intro}>
            <Text style={m.introText}>
              Fort Worth doesn't get nearly enough credit for its happy hour game. Whether you want white tablecloth seafood at bar prices, a proper Irish pint on Crockett Street, sweeping rooftop views downtown, a riverside patio that welcomes your dog, or a mezcal hall that most of the city doesn't know about yet — you're covered. Here are our five picks for where to be on a Friday afternoon.
            </Text>
          </View>

          {/* ── Spot list ────────────────────────────────────────────────────── */}
          {SPOTS.map(spot => (
            <View key={spot.rank} style={m.spotCard}>

              {/* Spot image */}
              <TouchableOpacity onPress={() => setActiveSpot(activeSpot?.rank === spot.rank ? null : spot)}>
                <View style={m.spotImageWrap}>
                  <Image source={{ uri: spot.image.uri }} style={m.spotImage} resizeMode="cover" />
                  <View style={m.spotImageOverlay} />
                  <View style={m.spotRankBadge}>
                    <Text style={m.spotRankText}>{spot.rank}</Text>
                  </View>
                  <Text style={m.spotImageCredit}>{spot.image.credit}</Text>
                </View>
              </TouchableOpacity>

              {/* Spot content */}
              <View style={m.spotContent}>
                {/* Name + neighborhood */}
                <View style={m.spotNameRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={m.spotName}>{spot.name}</Text>
                    <Text style={m.spotNeighborhood}>{spot.neighborhood}</Text>
                  </View>
                  <TouchableOpacity style={m.mapBtn} onPress={() => openMaps(spot)}>
                    <Ionicons name="location-outline" size={14} color={colors.orange} />
                    <Text style={m.mapBtnText}>Map</Text>
                  </TouchableOpacity>
                </View>

                {/* Happy hour hours */}
                <View style={m.hoursRow}>
                  <Ionicons name="time-outline" size={13} color={colors.textMuted} />
                  <Text style={m.hoursText}>
                    {spot.happyHourDays}  ·  {spot.happyHourTimes}
                  </Text>
                </View>

                {/* Vibe tag */}
                <Text style={m.vibeText}>{spot.vibe}</Text>

                {/* Description */}
                <Text style={m.spotDesc}>{spot.description}</Text>

                {/* Must order */}
                <View style={m.mustOrderRow}>
                  <Ionicons name="star" size={12} color={colors.orange} />
                  <Text style={m.mustOrderLabel}>Must order: </Text>
                  <Text style={m.mustOrderVal}>{spot.mustOrder}</Text>
                </View>

                {/* Insider tip */}
                <View style={m.tipRow}>
                  <Ionicons name="bulb-outline" size={13} color={colors.textMuted} />
                  <Text style={m.tipText}>{spot.tip}</Text>
                </View>
              </View>

              {/* Divider between spots (except last) */}
              {spot.rank < SPOTS.length && <View style={m.spotDivider} />}
            </View>
          ))}

          {/* ── Footer ───────────────────────────────────────────────────────── */}
          <View style={m.storyFooter}>
            <View style={m.storyFooterLine} />
            <Text style={m.storyFooterText}>Funkytown Fit · Fort Worth, TX</Text>
            <Text style={m.storyFooterSub}>
              Know a spot we missed? Post it in the community feed.
            </Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Styles: Card ─────────────────────────────────────────────────────────────

const st = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  imageWrap: {
    height: 200,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  featuredBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.orange,
    borderRadius: radius.xs,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  featuredBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1.8,
  },
  cardBody: {
    padding: spacing.md,
  },
  category: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.4,
    lineHeight: 26,
    marginBottom: 8,
  },
  teaser: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: colors.orange,
  },
  authorText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.orange,
    letterSpacing: 0.3,
  },
});

// ─── Styles: Modal ────────────────────────────────────────────────────────────

const m = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 2,
  },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.cardElevated,
    borderWidth: 1, borderColor: colors.cardBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: {
    paddingBottom: 60,
  },

  // Hero
  heroWrap: {
    height: 260,
    position: 'relative',
  },
  heroImg: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.58)',
  },
  heroTextBlock: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.5,
  },

  // Intro
  intro: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  introText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  // Spot card
  spotCard: {
    marginTop: spacing.md,
  },
  spotImageWrap: {
    height: 220,
    position: 'relative',
  },
  spotImage: {
    width: '100%',
    height: '100%',
  },
  spotImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  spotRankBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotRankText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
  spotImageCredit: {
    position: 'absolute',
    bottom: 6,
    right: 10,
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    fontStyle: 'italic',
  },
  spotContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  spotNameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  spotName: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  spotNeighborhood: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.cardBorderBright,
    backgroundColor: colors.cardElevated,
    marginTop: 4,
  },
  mapBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  hoursText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  vibeText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  spotDesc: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 14,
  },
  mustOrderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.cardElevated,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  mustOrderLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  mustOrderVal: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  spotDivider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },

  // Footer
  storyFooter: {
    padding: spacing.lg,
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: 8,
  },
  storyFooterLine: {
    width: 40,
    height: 1,
    backgroundColor: colors.cardBorderBright,
    marginBottom: 6,
  },
  storyFooterText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  storyFooterSub: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 17,
  },
});
