import { supabase } from "../_utils/supabase.ts";

Deno.serve(async (req: Request) => {
    const { headers } = req;
    if (headers.get('API-KEY') !== Deno.env.get("APP_API_KEY")){
        return Response.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Content-Type': 'application/json' } })
    }
    const { data: businesses, error } = await supabase.from('Business').select("id");
    if (error) {
        return Response.json({ error: 'Failed to get business' }, { status: 500, headers: { 'Content-Type': 'application/json' } })
    }
    const services: { id: number, name: string }[]  = []
    for (const { id } of businesses) {
        for (const { name, description, styles } of blackHairstyles) {
            const { data: service, error } = await supabase
                .from('Service')
                .insert({ name, description, enabled: true, business_id: id })
                .select()
                .single()
            if (error) {
                return Response.json({ error: 'Failed to create service' }, { status: 500, headers: { 'Content-Type': 'application/json' } })
            }
            services.push(service)
            for (const { name, description } of styles) {
                const { data: style, error } = await supabase
                    .from('Style')
                    .insert({ name, description, enabled: true, service_id: service.id })
                    .select()
                    .single()
                if (error) {
                    return Response.json({ error: 'Failed to create service option' }, { status: 500, headers: { 'Content-Type': 'application/json' } })
                }
                await supabase
                  .from('Variant')
                  .insert({ name: "Standard", duration:  30, enabled: true, price: 30, style_id: style.id })
                  .select()
                  .single()
              if (error) {
                  return Response.json({ error: 'Failed to create service option' }, { status: 500, headers: { 'Content-Type': 'application/json' } })
              }
            }
        }
    }
    return Response.json({}, { status: 200, headers: { 'Content-Type': 'application/json' } })
})

const blackHairstyles: { name: string, description: string, styles:  { name: string, description: string }[] }[] = [
    {
      name: "Braids",
      description: "Protective and stylish braiding techniques for all hair types.",
      styles: [
        { name: "Box Braids", description: "Neat, square-sectioned braids for a classic look." },
        { name: "Micro Braids", description: "Thin, delicate braids for a lightweight feel." },
        { name: "Knotless Braids", description: "Seamless braids with no tension at the roots." },
        { name: "Jumbo Braids", description: "Thicker braids for a bold and stylish statement." },
        { name: "Goddess Braids", description: "Larger, intricate braids with a soft, wavy finish." },
        { name: "Fulani Braids", description: "Braided patterns with feed-in extensions and accessories." },
        { name: "Halo Braid", description: "A single, large braid wrapped around the head." },
        { name: "Lemonade Braids", description: "Side-swept braids with a sleek finish." },
        { name: "Bob Braids", description: "Shoulder-length braids for a chic, modern style." },
        { name: "Fishbone Braids", description: "Intricate braiding pattern resembling a fishbone." },
        { name: "Crochet Braids", description: "Pre-looped braids attached using a crochet method." }
      ]
    },
    {
      name: "Twists",
      description: "A stylish and protective option using twisted strands.",
      styles: [
        { name: "Two-Strand Twists", description: "Classic two-strand twisted sections of hair." },
        { name: "Havana Twists", description: "Large, chunky twists for a voluminous look." },
        { name: "Marley Twists", description: "Natural-textured twists using Marley hair." },
        { name: "Passion Twists", description: "Soft, wavy twists with a lightweight feel." },
        { name: "Senegalese Twists", description: "Smooth and sleek rope-like twists." },
        { name: "Flat Twists", description: "Twisted sections laid flat against the scalp." },
        { name: "Spring Twists", description: "Bouncy, curly twists for a natural look." },
        { name: "Kinky Twists", description: "Coarse-textured twists for a full appearance." },
        { name: "Twist-Out", description: "Defined curls achieved by unraveling twists." },
        { name: "Braid-Out", description: "Textured waves created by unraveling braids." }
      ]
    },
    {
      name: "Locs",
      description: "A long-term protective style with matted or twisted hair.",
      styles: [
        { name: "Locs", description: "Natural, matured locs formed over time." },
        { name: "Faux Locs", description: "Temporary locs created with extensions." },
        { name: "Sisterlocks", description: "Small, uniform locs for a refined look." },
        { name: "Freeform Locs", description: "Naturally formed locs with minimal manipulation." },
        { name: "Wick Locs", description: "Thicker, freeform-style locs with bold volume." },
        { name: "Palm Rolled Locs", description: "Maintained locs using a rolling technique." },
        { name: "Interlocked Locs", description: "Locs maintained with an interlocking method." },
        { name: "Microlocs", description: "Tiny, lightweight locs with versatile styling." },
        { name: "Butterfly Locs", description: "Soft, distressed locs for a boho look." }
      ]
    },
    {
      name: "Cornrows",
      description: "Sleek, close-to-the-scalp braiding styles.",
      styles: [
        { name: "Straight-Back Cornrows", description: "Classic cornrows braided straight back." },
        { name: "Zig-Zag Cornrows", description: "Braided designs with a zig-zag pattern." },
        { name: "Feed-In Cornrows", description: "Braids with added hair for a natural blend." },
        { name: "Stitch Braids", description: "Defined, sectioned cornrows with a sleek finish." },
        { name: "Tribal Cornrows", description: "Braided styles inspired by traditional patterns." },
        { name: "Side-Part Cornrows", description: "Cornrows parted to one side for a stylish look." },
        { name: "Heart-Shaped Cornrows", description: "Cornrows styled into heart patterns." }
      ]
    },
    {
      name: "Afros",
      description: "Voluminous, natural curly styles for a bold look.",
      styles: [
        { name: "Afro", description: "A rounded, natural hairstyle with volume." },
        { name: "Tapered Afro", description: "A shaped afro with shorter sides." },
        { name: "Coily Fro", description: "Tightly coiled natural curls in an afro shape." },
        { name: "Blowout Afro", description: "A stretched, fluffy version of an afro." },
        { name: "TWA (Teeny Weeny Afro)", description: "A short, natural afro style." },
        { name: "Picked-Out Afro", description: "A fully fluffed and defined afro." },
        { name: "Afro Puffs", description: "Two or more puffed sections of hair." }
      ]
    },
    {
      name: "Short Styles",
      description: "Low-maintenance and stylish short cuts.",
      styles: [
        { name: "Finger Waves", description: "Sculpted waves for a sleek look." },
        { name: "Tapered Cut", description: "Short sides with longer top styling." },
        { name: "High Top Fade", description: "Short sides with a high, shaped top." },
        { name: "Buzz Cut", description: "A short, evenly cut hairstyle." },
        { name: "360 Waves", description: "Defined wave pattern across the scalp." },
        { name: "Shadow Fade", description: "A gradual fade blending into the hair." },
        { name: "Temple Fade", description: "A faded look concentrated around the temples." }
      ]
    },
    {
      name: "Updos",
      description: "Elegant and protective styles worn up.",
      styles: [
        { name: "Bantu Knots", description: "Small coiled buns sectioned across the head." },
        { name: "Halo Braid", description: "A single braid wrapped around the head." },
        { name: "Pineapple Updo", description: "Curly hair piled high on top of the head." },
        { name: "Braided Bun", description: "A braided style secured into a bun." },
        { name: "Twist Bun", description: "A bun created using twists." },
        { name: "High Puff", description: "A puffed section of natural curls secured high." },
        { name: "Faux Hawk", description: "A mohawk-styled updo with curls or braids." }
      ]
    },
    {
      name: "Straightened Styles",
      description: "Temporary heat-styled straight hair looks.",
      styles: [
        { name: "Silk Press", description: "A sleek, straightened look with heat." },
        { name: "Blowout", description: "A stretched, voluminous straightened style." },
        { name: "Bone Straight Hair", description: "Ultra-straight and smooth hair." },
        { name: "Feathered Layers", description: "Straight hair with soft, feathered layers." }
      ]
    },
    {
      name: "Extensions & Wigs",
      description: "Versatile, low-maintenance styles using hairpieces.",
      styles: [
        { name: "Wigs", description: "Pre-styled hairpieces for an instant look." },
        { name: "Weaves", description: "Sewn-in extensions for added length and volume." },
        { name: "Clip-Ins", description: "Temporary clip-in extensions for easy styling." },
        { name: "Lace Front Wigs", description: "Wigs with a natural lace front hairline." },
        { name: "Headband Wigs", description: "Wigs secured with a headband for easy wear." },
        { name: "Tape-Ins", description: "Flat adhesive extensions for seamless blending." }
      ]
    }
  ];