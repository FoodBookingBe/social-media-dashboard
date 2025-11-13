import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, ...params } = req.body;

    // For now, return mock data to demonstrate the interface
    // TODO: Replace with actual AI calls when models are available
    switch (action) {
      case 'generate_post':
        const mockPost = generateMockPost(params);
        return res.status(200).json(mockPost);

      case 'generate_image':
        return res.status(200).json({
          imageUrl: 'https://via.placeholder.com/1024x1024?text=AI+Generated+Image',
          altText: `AI gegenereerde afbeelding voor: ${params.prompt || 'social media'}`
        });

      case 'generate_hashtags':
        const hashtags = generateMockHashtags(params.content, params.platform, params.count || 5);
        return res.status(200).json({ hashtags });

      case 'analyze_performance':
        return res.status(200).json({
          score: 7,
          suggestions: [
            'Voeg een vraag toe om meer engagement te krijgen',
            'Gebruik meer emojis voor visuele aantrekkingskracht',
            'Maak de call-to-action duidelijker'
          ],
          predictedEngagement: 1250
        });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

function generateMockPost(params: any) {
  const { platform, topic, tone = 'professioneel' } = params;

  const templates: Record<string, Record<string, string>> = {
    instagram: {
      food: "🌟 Ontdek onze nieuwste creatie: verse pasta met huisgemaakte saus! Elke hap is een smaakexplosie die je doet watertanden. Kom langs en proef zelf! 🍝✨ #PastaLiefde #LokaleSmaken #Foodie",
      business: "🚀 Team uitbreiding! Welkom bij ons nieuwe talent dat onze visie naar een hoger niveau gaat tillen. Samen bouwen we aan de toekomst! 💪 #TeamWork #Groei #Innovatie",
      general: "✨ Nieuwe lente collectie gearriveerd! Ontdek duurzame mode die zowel stijlvol als milieubewust is. #DuurzameMode #Lente2025 #Fashion"
    },
    facebook: {
      food: "Nieuwe lente special: Verse salade met lokale groenten en huisgemaakte dressing. Gezond, lekker en goed voor het milieu! Kom snel langs in ons restaurant. 🥗🌱 #GezondEten #Lokaal #Restaurant",
      business: "Bedankt aan al onze geweldige klanten voor het vertrouwen! Samen maken we elke dag bijzonder. #Klantgericht #Dankbaar #Samen",
      general: "Zonnig weer vraagt om een terrasbezoek! Kom genieten van onze speciale lente cocktails. 🌞🍹 #ZomerSfeer #Cocktails #Terras"
    },
    linkedin: {
      business: "🚀 Spannende ontwikkelingen bij ons bedrijf! We zijn verheugd om onze nieuwste innovatie te presenteren die de manier verandert waarop bedrijven met hun klanten communiceren. #Innovatie #Business #Toekomst",
      general: "Reflectie op een succesvol jaar: Dank aan ons team, partners en klanten voor de geweldige samenwerking. Samen hebben we mooie resultaten behaald! #TeamWork #Succes #Dankbaar"
    },
    twitter: {
      general: "🚀 Game-changing update! Nieuwe features maken ons platform nog krachtiger. Wat vind jij de beste nieuwe functie? #Update #Tech #Innovatie"
    }
  };

  const platformKey = platform.toLowerCase();
  const platformTemplates = templates[platformKey] || templates.instagram;
  const content = platformTemplates[topic] || platformTemplates.general;

  return {
    content: content,
    hashtags: extractHashtags(content),
    caption: content.replace(/#[a-zA-Z0-9_]+/g, '').trim(),
    suggestedPostingTime: getOptimalPostingTime(platform)
  };
}

function extractHashtags(content: string): string[] {
  const hashtagRegex = /#[a-zA-Z0-9_]+/g;
  return content.match(hashtagRegex) || [];
}

function generateMockHashtags(content: string, platform: string, count: number): string[] {
  const baseHashtags: Record<string, string[]> = {
    instagram: ['#Love', '#Instagood', '#PhotoOfTheDay', '#Beautiful', '#Happy', '#Fashion', '#Foodie', '#Travel', '#Nature', '#Art'],
    facebook: ['#Community', '#Together', '#Local', '#Support', '#Family', '#Friends', '#Life', '#Happy', '#Love', '#Share'],
    linkedin: ['#Business', '#Innovation', '#Leadership', '#Success', '#Growth', '#Team', '#Future', '#Technology', '#Network', '#Professional'],
    twitter: ['#News', '#Trending', '#Tech', '#Life', '#Share', '#Community', '#Update', '#Tips', '#Fun', '#Today']
  };

  const platformKey = platform.toLowerCase();
  const platformHashtags = baseHashtags[platformKey] || baseHashtags.instagram;
  return platformHashtags.slice(0, count);
}

function getOptimalPostingTime(platform: string): string {
  const times: Record<string, string> = {
    'instagram': 'Donderdag 14:00-16:00',
    'facebook': 'Woensdag 13:00-15:00',
    'linkedin': 'Dinsdag 10:00-12:00',
    'twitter': 'Donderdag 15:00-17:00',
    'tiktok': 'Zaterdag 19:00-21:00'
  };

  const platformKey = platform.toLowerCase();
  return times[platformKey] || 'Woensdag 14:00-16:00';
}
