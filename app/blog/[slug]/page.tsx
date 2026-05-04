import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Calendar, ArrowRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { JsonLd, articleLD, breadcrumbLD } from '@/lib/seo';

export const revalidate = 3600;

// ── Full blog content ──────────────────────────────────────────

const FULL_CONTENT: Record<string, string> = {
  'best-dog-food-brands-india': `
<p>Choosing the right dog food in India is harder than it looks. Supermarket shelves are packed with options, prices range from ₹300 to ₹6,000 per bag, and marketing claims are often misleading. This guide cuts through the noise.</p>

<h2>What Makes a Good Dog Food?</h2>
<p>Before looking at brands, understand what to look for on the label. The first ingredient listed should be a named protein source — chicken, lamb, fish, or beef. If it says "chicken meal," that's acceptable; "poultry by-product" or "meat and bone meal" are low-quality fillers.</p>
<p>Look for the AAFCO (Association of American Feed Control Officials) statement or the BIS (Bureau of Indian Standards) certification. These guarantee the food meets minimum nutritional standards for the stated life stage.</p>

<h2>Top Dog Food Brands Available in India (2026)</h2>

<h3>1. Royal Canin — Best for Breed-Specific Needs</h3>
<p>Royal Canin makes breed-specific formulas that account for jaw shape, coat type, and common health issues. Their Labrador, Golden Retriever, and German Shepherd formulas are genuinely well-designed. Expensive (₹2,500–₹5,000 for 3kg) but worth it for large breeds with specific needs.</p>

<h3>2. Drools — Best Value for Indian Families</h3>
<p>India-made and priced for Indian budgets (₹800–₹2,000 for 3kg). Drools has significantly improved quality over the past two years. Their "Focus Adult Super Premium" range uses real chicken as the first ingredient. Good for mixed breeds and Indian Pariah Dogs.</p>

<h3>3. Pedigree — Widely Available, Budget Tier</h3>
<p>Pedigree is India's most widely available brand — you'll find it in every supermarket. It's adequate as a base diet but not ideal as the sole food. Consider supplementing with boiled chicken, eggs, or vegetables if using Pedigree long-term.</p>

<h3>4. Orijen — Premium Import Option</h3>
<p>Canadian brand available through specialty pet shops and online. 85% meat ingredients, grain-free, biologically appropriate. At ₹6,000+ for 2kg, it's expensive but nutritionally superior. Good for dogs with sensitive stomachs or allergies.</p>

<h3>5. Farmina — Italian Quality, India-Available</h3>
<p>Farmina N&D (Natural & Delicious) is cold-pressed and uses high-quality Italian ingredients. Available in India for ₹3,500–₹5,500 per 2.5kg. Their grain-free ancestral grain options are excellent for dogs with grain sensitivities.</p>

<h2>Indian-Made Alternatives Worth Considering</h2>
<p>Several Indian brands have improved dramatically: <strong>Chappi</strong> (budget-friendly, widely available), <strong>Arden Grange</strong> (UK-sourced, sold in India), and <strong>Acana</strong> (available via importers). Always check the manufacturing date — imported foods sometimes sit in warehouses for months in Indian heat.</p>

<h2>How Much to Feed</h2>
<p>The feeding guide on the packaging is a starting point, not a rule. Every dog is different. A general formula: feed 2-3% of your dog's target body weight per day. Adjust based on body condition — you should be able to feel the ribs but not see them.</p>

<h2>Red Flags to Avoid</h2>
<ul>
<li>First ingredient is corn, wheat, or soy</li>
<li>No AAFCO or BIS statement</li>
<li>Artificial preservatives: BHA, BHT, ethoxyquin</li>
<li>Vague protein sources: "animal digest," "meat meal"</li>
<li>No manufacturing date or short shelf life remaining</li>
</ul>

<h2>Transition Slowly</h2>
<p>Always switch foods over 10 days: 25% new + 75% old for days 1–3, 50/50 for days 4–6, 75% new for days 7–9, then 100% new from day 10. Abrupt switches cause digestive upset in most dogs.</p>

<p>The best dog food is the one your dog digests well, enjoys eating, maintains a healthy weight on, and that fits your budget consistently. An expensive food fed inconsistently is worse than a mid-range food fed reliably.</p>
`,

  'homemade-dog-food-recipe-indian-dogs': `
<p>Many Indian families prefer feeding their dogs home-cooked food. It can be nutritious and cost-effective — but it requires more planning than opening a bag of kibble. Here is a complete guide.</p>

<h2>Is Homemade Food Good for Dogs?</h2>
<p>Yes, if done correctly. The key word is "correctly." Homemade diets are almost universally deficient in calcium, zinc, Vitamin D, and Vitamin B12 unless you add a veterinary-recommended supplement powder. This is non-negotiable — deficiencies develop slowly and cause serious long-term damage.</p>

<h2>Safe Indian Ingredients</h2>
<h3>Proteins (should be 50-60% of the meal):</h3>
<ul>
<li>Boiled chicken (boneless, no skin, no salt)</li>
<li>Boiled eggs (whole egg, including yolk)</li>
<li>Boiled fish — rohu, sardines, mackerel (boneless)</li>
<li>Boiled mutton (boneless)</li>
<li>Paneer (in moderation, for vegetarian families)</li>
<li>Cooked lentils — dal (must be well-cooked, no spices)</li>
</ul>

<h3>Carbohydrates (30-40% of the meal):</h3>
<ul>
<li>Cooked brown rice</li>
<li>Cooked sweet potato</li>
<li>Cooked oats</li>
<li>Cooked quinoa</li>
</ul>

<h3>Vegetables (10-15%):</h3>
<ul>
<li>Boiled carrots</li>
<li>Boiled green beans</li>
<li>Boiled peas</li>
<li>Spinach (small amounts)</li>
</ul>

<h2>Recipe 1: Basic Chicken & Rice (Daily Staple)</h2>
<p><strong>Ingredients for one day (15kg dog):</strong></p>
<ul>
<li>200g boiled chicken (no salt, no oil)</li>
<li>100g cooked brown rice</li>
<li>50g boiled vegetables (carrots + beans)</li>
<li>1 boiled egg</li>
<li>Veterinary supplement powder (as directed)</li>
</ul>
<p><strong>Instructions:</strong> Boil chicken until fully cooked. Remove all bones. Mix with rice and vegetables at room temperature. Add supplement. Divide into 2 equal meals. Store up to 3 days refrigerated.</p>

<h2>Recipe 2: Fish & Sweet Potato (Omega-3 Boost)</h2>
<p><strong>Ingredients:</strong></p>
<ul>
<li>150g boiled sardines or rohu (boneless)</li>
<li>100g cooked sweet potato</li>
<li>1 boiled egg</li>
<li>30g cooked peas</li>
</ul>
<p>Excellent for coat health and brain development. Rotate with Recipe 1 weekly.</p>

<h2>Recipe 3: Egg & Dal (Budget-Friendly)</h2>
<p>For families managing costs: 3 boiled eggs + 100g well-cooked moong dal + 100g rice + 50g vegetables. Add paneer (30g) for extra protein. Must add supplement powder — lentil-based diets are especially low in calcium and Vitamin B12.</p>

<h2>NEVER Include These</h2>
<ul>
<li><strong>Onion and garlic</strong> — destroy red blood cells, even in small amounts</li>
<li><strong>Grapes and raisins</strong> — cause acute kidney failure</li>
<li><strong>Salt, spices, oil</strong> — keep all cooking plain</li>
<li><strong>Cooked bones of any kind</strong> — splinter risk, choking hazard</li>
<li><strong>Jaggery, sugar, mithai</strong> — obesity and dental disease</li>
<li><strong>Maida, bread, biscuits</strong> — empty calories, blood sugar spikes</li>
</ul>

<h2>The Non-Negotiable Supplement</h2>
<p>Products like Pet-Cal, Drools Calcium Supplement, or Himalaya Boniheal are available at pet shops and online. Follow the dosage on the packaging based on your dog's weight. Without this, homemade diets cause nutritional deficiencies within months — often invisible until significant damage has occurred.</p>

<h2>How Much to Feed</h2>
<p>Feed 2-3% of your dog's target body weight daily, split into 2 meals for adults and 3-4 meals for puppies. A 15kg adult dog needs approximately 300-450g of food per day. Adjust based on weight changes — weigh monthly.</p>
`,

  'stop-dog-pulling-on-leash': `
<p>Leash pulling is one of the most physically challenging behaviour problems in dogs — and one of the most common reasons people give up walking their dogs regularly. A 30kg Labrador pulling can cause genuine injuries in owners of any age. Here is how to fix it.</p>

<h2>Why Dogs Pull on Leash</h2>
<p>Dogs pull because nobody taught them not to. The walk is exciting — smells, sights, other dogs — and forward momentum is their natural response to that excitement. Every time they pulled and you followed, they learned: pulling = forward movement. The habit was trained, not chosen.</p>
<p>Dogs do not pull to dominate you. Pulling is an excitement behaviour, not a dominance behaviour. Understanding this changes how you approach the solution.</p>

<h2>The Equipment Matters First</h2>
<p>Before training, get the right equipment. A collar and standard leash gives the dog maximum leverage against your arm. Consider:</p>
<ul>
<li><strong>Front-clip harness</strong>: Attaches at the chest, redirects the dog toward you when they pull. Best management tool while training.</li>
<li><strong>Head halter (Gentle Leader, Halti)</strong>: Controls the head, which controls the body. Very effective for strong dogs. Introduce gradually.</li>
<li><strong>Avoid</strong>: Retractable leashes (teaches that pulling extends range), prong collars, choke chains (cause injury, do not solve the problem).</li>
</ul>

<h2>The "Be a Tree" Technique</h2>
<p>This is the simplest, most effective loose-leash walking method:</p>
<ol>
<li>The moment the leash goes tight — stop completely. Plant your feet. Do not move.</li>
<li>Wait in silence. Do not say anything. Do not look at the dog.</li>
<li>When the dog looks back at you or moves toward you to release the tension — mark it with "Yes!" and immediately resume walking as a reward.</li>
<li>Repeat every single time the leash tightens.</li>
</ol>
<p>The first few sessions will be frustrating — you may only cover 50 metres in 20 minutes. That is normal. Within 2–3 weeks of consistent application, most dogs show significant improvement.</p>

<h2>Change Direction Method</h2>
<p>When the dog pulls forward, turn 180° without warning and walk the other way. No words, no corrections. The dog learns that pulling means going backwards, not forwards. Combine with "Be a Tree" for faster results.</p>

<h2>Reward Frequently for Loose Leash</h2>
<p>Do not wait for problems. Every 3–5 steps of walking on a loose leash, say "Yes!" and give a small treat. Gradually increase the distance between rewards as the dog improves. Make walking calmly on leash the most rewarding thing that happens on a walk.</p>

<h2>Common Mistakes</h2>
<ul>
<li>Allowing pulling when you are in a hurry — this undoes days of training</li>
<li>Letting the dog greet people or sniff while pulling — this rewards the pull</li>
<li>Using a retractable leash during training</li>
<li>Expecting improvement in one session — this takes weeks</li>
<li>Different rules for different family members</li>
</ul>

<h2>Timeline for Results</h2>
<p>With daily consistent training: noticeable improvement in 2–4 weeks, reliable loose-leash walking in 6–10 weeks for most dogs. Strong pullers or dogs with long-established habits may take 3–4 months. Patience and absolute consistency are the only required ingredients.</p>
`,

  'summer-dog-care-india': `
<p>India's summers are dangerous for dogs. With temperatures regularly reaching 40–48°C in cities like Delhi, Nagpur, and Ahmedabad, the risks of heat stroke, dehydration, and paw burns are very real. Here is your complete seasonal guide.</p>

<h2>Understanding How Dogs Handle Heat</h2>
<p>Dogs cannot sweat. They lose heat almost entirely through panting — a much less efficient system than human perspiration. Brachycephalic breeds (Pugs, Shih Tzus, Boxers, Bulldogs) have compressed airways that make panting even less effective, putting them at extreme risk. Thick-coated breeds like Golden Retrievers and Huskies also struggle far more than short-coated breeds like Dobermans.</p>

<h2>Heat Stroke: Recognise and Respond Immediately</h2>
<p>Heat stroke is a medical emergency that kills within minutes. Know the signs:</p>
<ul>
<li>Heavy, rapid panting that won't slow down</li>
<li>Excessive drooling, foamy saliva</li>
<li>Bright red gums and tongue</li>
<li>Vomiting or diarrhoea</li>
<li>Confusion, stumbling, weakness</li>
<li>Collapse or seizures</li>
</ul>
<p><strong>Emergency response:</strong> Move the dog to shade or air conditioning immediately. Apply cool (not cold) water to the neck, armpits, groin, and paws. Never use ice — it constricts blood vessels and slows cooling. Fan the dog while keeping it wet. Rush to the vet while cooling continues. Every minute matters.</p>

<h2>Daily Summer Routines</h2>
<h3>Exercise timing:</h3>
<p>Walk only before 7:30 AM or after 7:30 PM when ground temperatures are tolerable. The tarmac and concrete in Indian cities reach 60–70°C in afternoon sun and will burn paw pads in seconds. Test the ground with your palm — if you cannot hold it for 5 seconds, it is too hot for paws.</p>

<h3>Hydration:</h3>
<p>Multiple water bowls in every room. Change water twice daily — dogs often refuse stale warm water. Add ice cubes if available. For outdoor dogs, use a large stainless steel bowl in full shade. Check and refill every 2 hours. Offer water before, during, and after any activity.</p>

<h3>Cooling strategies:</h3>
<ul>
<li>Wet a towel and let the dog lie on it</li>
<li>Freeze treats in ice cubes (chicken broth ice cubes are a favourite)</li>
<li>Use a cooling mat or vest for outdoor time</li>
<li>Keep at least one room air-conditioned during peak heat (11 AM–5 PM)</li>
<li>Allow access to cool floor tiles</li>
</ul>

<h2>The Never-Do-This List</h2>
<ul>
<li><strong>Never leave a dog in a parked car</strong> — even for 2 minutes, even with windows cracked. Car interiors reach 70°C within minutes.</li>
<li><strong>Never walk during afternoon hours</strong> in summer (11 AM–6 PM).</li>
<li><strong>Never muzzle a dog outside in summer</strong> — muzzles prevent panting, the only cooling mechanism dogs have.</li>
<li><strong>Never shave a double-coated breed</strong> — their undercoat provides insulation against both cold AND heat.</li>
</ul>

<h2>Grooming for Summer</h2>
<p>Regular brushing removes the dead undercoat that traps heat. For single-coated breeds, a short summer trim is beneficial. For double-coated breeds (Labs, GSDs, Goldens), brush frequently but do not shave. Check paw pads weekly for cracks or burns.</p>

<h2>Special Considerations for Indian Breeds</h2>
<p>Indian Pariah Dogs are the most heat-tolerant breed — naturally evolved for the subcontinent. They handle Indian summers far better than imported breeds. If you are considering getting a dog, an INDog is the most sustainable choice for Indian families.</p>
`,

  'choosing-safe-dog-harness': `
<p>The right harness makes every walk better — for your dog and for you. The wrong one causes rubbing, restricts movement, and in the case of a strong puller, may do more harm than good. Here is how to choose correctly.</p>

<h2>Why a Harness Over a Collar?</h2>
<p>Collars, especially on dogs that pull, concentrate force on the neck. This can cause tracheal damage in small dogs and neck injuries in persistent large-breed pullers. A harness distributes pressure across the chest and shoulders — a much larger and more robust area. For puppies, dogs with respiratory issues, and consistent pullers, a harness is always safer.</p>

<h2>Types of Harnesses</h2>

<h3>1. Back-Clip Harness</h3>
<p>The leash attaches at the back. Comfortable for calm dogs and good for everyday walking. The problem: it gives dogs additional leverage to pull, making it ineffective for training pullers. Good choice for small, gentle dogs.</p>

<h3>2. Front-Clip (No-Pull) Harness</h3>
<p>The leash attaches at the chest. When the dog pulls forward, the clip redirects them sideways toward you, interrupting the pulling motion. The most effective management tool for dogs in training. Our <a href="/products">Polymer Harnesses</a> include front-clip options suitable for all sizes.</p>

<h3>3. Dual-Clip Harness</h3>
<p>Has both front and back attachment points. Offers maximum control and flexibility. Recommended for strong dogs, reactive dogs, and those in active training. Use the front clip for walks, the back clip for secure off-leash activities.</p>

<h3>4. Step-In Harness</h3>
<p>The dog steps into leg holes and you clip at the back. Easy to put on, but offers less control and can slip on narrow-chested breeds. Good for dogs that dislike things going over their head.</p>

<h3>5. Padded Comfort Harness</h3>
<p>Thick padding protects against rubbing, especially on longer walks. Essential for dogs worn for more than 30 minutes at a stretch. Our <a href="/products">Premium Comfort Harnesses</a> use breathable mesh lining suitable for Indian heat.</p>

<h2>Sizing: Getting It Right</h2>
<p>Measure your dog's chest girth at the widest point — just behind the front legs. Add 2–3 cm for comfort. Never buy a harness that requires the dog to grow into it — ill-fitting harnesses cause rubbing and restricted movement.</p>
<p>Test the fit: you should be able to slide two fingers under any strap. The harness should not shift when the dog moves and should not cause any skin folding or rubbing marks after a 15-minute walk.</p>

<h2>Material Guide for Indian Conditions</h2>
<ul>
<li><strong>Nylon webbing</strong>: Most common, durable, washable. Holds up well in monsoon. Best for everyday use.</li>
<li><strong>Polymer fabric</strong>: Weather-resistant, quick-dry, excellent for active dogs. Resistant to mud and odour.</li>
<li><strong>Cotton/fabric</strong>: Soft and comfortable but slower to dry. Best for dry seasons and dogs with sensitive skin.</li>
<li><strong>Mesh lining</strong>: Essential in Indian heat — promotes airflow and reduces sweat buildup under the harness.</li>
</ul>

<h2>How to Fit and Introduce a New Harness</h2>
<p>Never force a harness on a reluctant dog. Spend a few sessions letting the dog sniff and investigate it. Put it on and immediately offer high-value treats. Keep the first session to 5 minutes. Gradually increase wear time over a week before attempting a full walk. This prevents the dog from developing a negative association with the harness.</p>
`,

  'grooming-tips-indian-dogs': `
<p>Grooming in India comes with specific challenges: high humidity causes matting, heat encourages parasites, monsoon brings mud, and many owners are not sure how often to bathe their dogs. This guide covers everything.</p>

<h2>Bathing: How Often Is Right?</h2>
<p>Most dogs need bathing once every 3–6 weeks. More frequent bathing strips the natural oils that protect the skin and coat. Less frequent bathing allows bacteria and allergens to accumulate on the skin — a significant problem in India's humid climate.</p>
<p>Exceptions: dogs that swim regularly need more frequent bathing. Dogs with skin conditions should follow their vet's schedule. Indian Pariah Dogs have particularly efficient self-cleaning coats and often need bathing only once a month.</p>

<h2>The Right Way to Bathe</h2>
<ol>
<li>Brush thoroughly before bathing — water tightens mats, making them harder to remove</li>
<li>Use lukewarm water, never hot or cold</li>
<li>Use a dog-specific shampoo — human shampoos disrupt the skin's pH</li>
<li>Massage shampoo into the coat for 3–5 minutes</li>
<li>Rinse thoroughly — leftover shampoo causes itching</li>
<li>Dry completely before letting the dog outside — damp coats attract dirt and cause skin infections</li>
</ol>

<h2>Brushing: The Foundation of Coat Health</h2>
<p>Brushing frequency depends on coat type:</p>
<ul>
<li><strong>Short coats (Beagle, Labrador, Pariah Dog)</strong>: Weekly brushing with a rubber brush or bristle brush</li>
<li><strong>Medium coats (German Shepherd, Golden Retriever)</strong>: 2–3 times per week with a slicker brush and undercoat rake during shedding seasons</li>
<li><strong>Long coats (Shih Tzu, Pomeranian)</strong>: Daily brushing with a pin brush to prevent mats; professional grooming every 4–6 weeks</li>
</ul>
<p>Always brush in the direction of coat growth. Never yank at mats — use a detangling spray and work from the outside in with your fingers first.</p>

<h2>Ear Care: Critical in Indian Humidity</h2>
<p>Ear infections are among the most common health issues in Indian dogs — humidity creates ideal conditions for yeast and bacteria. Check ears weekly. Signs of infection: odour, dark discharge, redness, head shaking, scratching at ears.</p>
<p>Clean ears once a week with a vet-recommended ear cleaner and cotton ball. Never insert anything into the ear canal. Never use Q-tips. Never use oil, vinegar, or home remedies without veterinary guidance.</p>

<h2>Nail Trimming</h2>
<p>Overgrown nails cause discomfort, change gait, and can grow into the paw pad. Trim every 3–4 weeks, or when you hear clicking on hard floors. Use dog-specific nail clippers. Clip just the tip — avoid the pink quick (blood vessel). If you cut the quick, apply styptic powder or cornflour to stop bleeding.</p>

<h2>Dental Care: The Most Neglected Part</h2>
<p>By age 3, 80% of Indian dogs show dental disease. Daily tooth brushing with a dog-safe toothpaste is the gold standard. Never use human toothpaste — fluoride and xylitol are toxic to dogs. Dental chews and water additives help but do not replace brushing.</p>

<h2>Tick and Flea Checks</h2>
<p>After every outdoor walk in monsoon season, check behind the ears, between the toes, under the collar, around the tail base, and in the groin area. Remove ticks within 24 hours using tweezers or a tick-removal tool — never crush with fingers. Use vet-recommended prevention year-round.</p>
`,

  'puppy-training-basics': `
<p>The first 16 weeks of a puppy's life are the most important for shaping their adult personality and behaviour. What you do — and do not do — during this period has a lasting impact. This guide covers the essentials.</p>

<h2>The Socialisation Window: Your Most Important Opportunity</h2>
<p>Between 8 and 16 weeks, the puppy's brain is uniquely open to new experiences. Every positive exposure during this window — to people, sounds, surfaces, vehicles, other animals — permanently shapes the puppy's ability to handle those things calmly as an adult. Miss this window and you spend years working against fear responses that could have been prevented in weeks.</p>
<p>Before vaccination is complete, you can still socialise safely: carry the puppy in areas with known, vaccinated dogs. Invite vaccinated friends' dogs for home visits. Expose to different sounds, surfaces, and people inside the home.</p>

<h2>House Training: The First Priority</h2>
<p>Puppies need to eliminate after waking, after eating, after play, and roughly every 2 hours. The formula for success:</p>
<ol>
<li>Take the puppy outside every 2 hours, immediately after meals, and first thing in the morning</li>
<li>Wait in the designated toilet spot until they go</li>
<li>The moment they finish — not after you return inside — say "Yes!" and give a treat</li>
<li>Supervise constantly indoors, or use a crate when you cannot watch</li>
<li>When an accident happens, clean with enzymatic cleaner; never punish after the fact</li>
</ol>
<p>Most puppies are reliably house-trained by 4–5 months with consistent application of this approach.</p>

<h2>Basic Commands: The Foundation</h2>
<h3>Sit (Week 1–2):</h3>
<p>Hold a treat above the puppy's nose and slowly move it back over the head. As the bottom lowers, say "Sit" clearly once. The moment they sit, mark with "Yes!" and reward. Practice 10 times per session, 3 sessions per day.</p>

<h3>Stay (Week 2–3):</h3>
<p>Ask for a sit. Take one small step back. Return and reward. Build duration and distance one step at a time over weeks. Never push past the puppy's ability — always end on success.</p>

<h3>Come (Week 1 onwards):</h3>
<p>Never chase the puppy — this becomes a game. Crouch down, open arms, use an enthusiastic happy voice: "Bhoomi, come!" Reward massively when they arrive. Never call the puppy to punish. Recall must always predict wonderful things.</p>

<h2>Bite Inhibition: Non-Negotiable</h2>
<p>Puppies explore with their mouths. They also learn the appropriate pressure of biting from their littermates. If a bite is too hard, the other puppy yelps and stops playing — the biter learns. You must replicate this: when your puppy bites too hard, let out a short "Ouch!" and withdraw all attention for 30 seconds. Resume play. If the biting continues — leave the room entirely.</p>

<h2>What Not to Do</h2>
<ul>
<li>Do not tap or flick the puppy's nose for biting — this causes hand-shyness and fear</li>
<li>Do not use punishment — it creates fear and damages trust during the critical socialisation window</li>
<li>Do not repeat commands — say them once, wait, and help the puppy succeed</li>
<li>Do not train when you are frustrated — puppies read your emotional state</li>
<li>Do not expose to unvaccinated dogs in public before the primary series is complete</li>
</ul>

<h2>Training Session Length</h2>
<p>Puppies have very short attention spans. Three-minute sessions, 4–5 times per day, are far more effective than one 30-minute session. Always end on a success — finish with something the puppy knows well and reward enthusiastically. Training should be the highlight of the puppy's day.</p>
`,

  'common-dog-health-issues': `
<p>India's climate, endemic diseases, and living conditions create specific health risks for dogs that dog owners in other countries do not face. Knowing what to watch for could save your dog's life.</p>

<h2>Tick Fever (Ehrlichiosis/Babesiosis)</h2>
<p>The most common serious disease in Indian dogs. Caused by tick-borne parasites. Both Ehrlichiosis and Babesiosis can be fatal without prompt treatment.</p>
<p><strong>Symptoms:</strong> Sudden high fever, lethargy, loss of appetite, pale gums, nosebleeds, swollen lymph nodes. Can progress to organ failure within days.</p>
<p><strong>Action:</strong> If your dog has a fever above 39.5°C — see a vet within 24 hours. Tick fever responds well to doxycycline when caught early. Delayed treatment causes permanent organ damage.</p>
<p><strong>Prevention:</strong> Year-round tick prevention is mandatory in India. Options: spot-on treatments (Frontline, Revolution), tick collars (Seresto), or oral tablets (NexGard, Bravecto). Check for ticks after every outdoor walk.</p>

<h2>Parvovirus</h2>
<p>Highly contagious, often fatal in unvaccinated puppies. The virus attacks the digestive system and survives in soil for up to a year.</p>
<p><strong>Symptoms:</strong> Severe bloody diarrhoea, vomiting, lethargy, loss of appetite. Death can occur within 48–72 hours without treatment.</p>
<p><strong>Action:</strong> This is an emergency. Rush to vet immediately. IV fluids and hospitalisation are required.</p>
<p><strong>Prevention:</strong> Complete the full vaccination series. Do not take unvaccinated puppies to public areas.</p>

<h2>Mange (Sarcoptic and Demodectic)</h2>
<p>Mange is extremely common in India, especially in dogs that interact with street dogs. Sarcoptic mange is contagious and can spread to humans.</p>
<p><strong>Symptoms:</strong> Intense itching, hair loss starting at ear edges and elbows, red crusted skin, weight loss in severe cases.</p>
<p><strong>Action:</strong> Vet diagnosis required — treatment depends on the type of mange. Do not attempt home treatment.</p>

<h2>Leptospirosis</h2>
<p>A bacterial disease spread through water and soil contaminated with infected animal urine. Particularly dangerous during and after monsoon. Can infect humans (zoonotic).</p>
<p><strong>Symptoms:</strong> Fever, muscle pain, vomiting, jaundice (yellow eyes/skin/gums), blood in urine, kidney/liver failure.</p>
<p><strong>Action:</strong> Emergency if jaundice appears. Antibiotics required — prescription only.</p>
<p><strong>Prevention:</strong> Annual Leptospirosis vaccination is strongly recommended, especially in monsoon-prone areas. Avoid letting dogs drink from puddles or floodwater.</p>

<h2>Heat Stroke</h2>
<p>Indian summers kill dogs every year. See our <a href="/blog/summer-dog-care-india">Summer Dog Care guide</a> for the full protocol. The key points: never leave a dog in a parked car, exercise only in early morning or evening, and know the emergency cooling procedure.</p>

<h2>Dental Disease</h2>
<p>80% of dogs over age 3 have dental disease. In India, where dental care is rarely considered, most dogs suffer quietly. Signs: bad breath, yellow tartar, reluctance to eat, pawing at mouth. Annual vet dental check-ups and daily brushing prevent the worst outcomes.</p>

<h2>When to Go to the Vet Immediately</h2>
<p>The following are emergencies — do not wait and watch:</p>
<ul>
<li>Pale, white, blue or yellow gums</li>
<li>Collapse or inability to stand</li>
<li>Unproductive retching with swollen belly</li>
<li>Seizures or loss of consciousness</li>
<li>Severe difficulty breathing</li>
<li>Body temperature above 40°C</li>
<li>Suspected poisoning (onion, grapes, xylitol)</li>
</ul>
`,

  'indian-pariah-dog-guide': `
<p>The Indian Pariah Dog — also known as the Desi Dog, INDog, or South Asian Pye Dog — is one of the oldest dog breeds in the world. Archaeological evidence places their ancestors in the Indian subcontinent over 4,500 years ago. They are not a mixed breed. They are a naturally evolved, genetically distinct breed that developed without human selection — only survival of the fittest.</p>

<h2>Why Adopt an Indian Pariah Dog?</h2>
<p>Three compelling reasons:</p>
<ol>
<li><strong>Naturally evolved for India</strong>: INDogs handle Indian heat, humidity, monsoon, and endemic diseases far better than imported breeds. Their immune systems are tuned to Indian pathogens. Their metabolism is adapted to Indian temperatures.</li>
<li><strong>Exceptional health</strong>: Without selective breeding, INDogs avoided most genetic diseases that plague pedigree breeds — no hip dysplasia, no brachycephalic syndrome, no hereditary heart conditions. Average lifespan: 13–15 years, often longer.</li>
<li><strong>Millions need homes</strong>: India has an estimated 35 million street dogs. Adopting an INDog directly reduces this population and saves a life.</li>
</ol>

<h2>Temperament</h2>
<p>INDogs are intelligent, alert, and deeply loyal to their family while remaining appropriately wary of strangers. They are not naturally aggressive — but they are instinctively territorial and will alert bark at unusual activity. This makes them excellent natural watchdogs without requiring any training.</p>
<p>They are independent thinkers. They will do what you ask when they understand why it benefits them — positive reinforcement training works exceptionally well. They are not the breed to repeat a command 20 times while getting ignored.</p>

<h2>Physical Characteristics</h2>
<ul>
<li>Weight: 14–22 kg (males slightly heavier)</li>
<li>Height: 46–56 cm at shoulder</li>
<li>Coat: Short, dense, flat coat that requires minimal grooming</li>
<li>Colour: Typically tan, brown, or black; some spotted</li>
<li>Build: Athletic, lean, built for endurance rather than power</li>
</ul>

<h2>Exercise and Activity</h2>
<p>INDogs are active dogs with a natural drive to patrol and explore. Two 30-minute walks per day satisfy most individuals. They excel at off-leash activities in secured areas. Unlike high-drive working breeds, they can self-regulate activity based on temperature — resting during peak heat, becoming active in cooler hours.</p>

<h2>Grooming</h2>
<p>This is the easiest-to-maintain coat in the dog world. A weekly brush with a rubber brush removes loose fur. Bathing once a month is typically sufficient. Check for ticks after outdoor walks — INDogs are resistant to many diseases but are not immune to tick-borne infections.</p>

<h2>Training</h2>
<p>INDogs are highly trainable with positive reinforcement. They learn commands quickly and retain them reliably. The independent streak means they respond poorly to punishment-based methods — but with treats, play, and patience, they are a pleasure to train. Basic obedience takes 4–6 weeks; they pick up complex commands faster than many pedigree breeds.</p>

<h2>Common Misconceptions</h2>
<p><strong>"They are aggressive"</strong>: Street dogs that bite are typically in pain, protecting territory, or have been abused. Socialised INDogs that are raised in homes are no more aggressive than any other breed.</p>
<p><strong>"They are dirty"</strong>: The Pariah coat is naturally self-cleaning. INDogs are among the cleanest breeds available.</p>
<p><strong>"They won't bond with you"</strong>: Completely false. INDogs bond deeply and permanently with their family — often described by their owners as Velcro dogs who follow them everywhere.</p>
`,

  'dog-vaccination-schedule-india': `
<p>Vaccination is the single most important preventive health measure you can take for your dog. Yet in India, vaccination schedules are often inconsistent, advice varies between vets, and many dog owners are uncertain about what is actually required. This guide gives you clarity.</p>

<h2>Core Vaccines: Non-Negotiable for Every Dog in India</h2>

<h3>DHPPi (Distemper, Hepatitis, Parvovirus, Parainfluenza)</h3>
<p>Given as a combination vaccine — one injection covers four diseases. This is the backbone of canine vaccination. Distemper and Parvovirus alone kill thousands of unvaccinated dogs in India every year.</p>
<p>Available as 5-in-1 (adds Leptospirosis) or 7-in-1 (adds more). Ask your vet which combination they use.</p>

<h3>Rabies</h3>
<p>Legally mandatory in India. Rabies is 100% fatal once symptoms appear in both dogs and humans. There is no treatment. Prevention through vaccination is the only option. Annual booster required (some 3-year vaccines exist — confirm with your vet).</p>

<h2>Puppy Schedule (Standard Indian Protocol)</h2>
<table>
<tr><th>Age</th><th>Vaccines</th><th>Notes</th></tr>
<tr><td>6–8 weeks</td><td>DHPPi (1st dose)</td><td>First vaccination — do not take puppy to public areas yet</td></tr>
<tr><td>9–12 weeks</td><td>DHPPi (2nd dose) + Rabies</td><td>Rabies required; add Leptospirosis if recommended</td></tr>
<tr><td>14–16 weeks</td><td>DHPPi (3rd/final dose)</td><td>Primary series complete; full protection 2 weeks later</td></tr>
<tr><td>1 year</td><td>DHPPi annual + Rabies booster</td><td>Annual boosters begin</td></tr>
</table>

<h2>Non-Core Vaccines: Recommended Based on Risk</h2>

<h3>Leptospirosis</h3>
<p>Strongly recommended for Indian dogs. Leptospirosis spreads through water and soil contaminated with infected animal urine — highly prevalent in India, especially during monsoon. It is also zoonotic — it can infect humans. The vaccine is available as part of 5-in-1 or as a separate injection.</p>

<h3>Kennel Cough (Bordetella)</h3>
<p>Recommended if your dog goes to dog parks, boarding facilities, or dog shows. Available as an intranasal vaccine or injection.</p>

<h2>Adult Boosters</h2>
<p>Annual DHPPi and Rabies boosters are required to maintain immunity. Some vets now offer titre testing — a blood test that measures antibody levels — as an alternative to blanket annual boosters for adult dogs. Discuss with your vet if this is appropriate for your dog.</p>

<h2>Where to Get Vaccinations in India</h2>
<p>Always use a licensed veterinary clinic. Vaccines require proper cold chain storage — temperatures above 8°C can render them ineffective. Pet shops selling vaccines cannot guarantee proper storage.</p>
<p>Cost range in India: ₹300–800 per combination vaccine visit depending on city and clinic. The Rabies vaccine is often subsidised and available through government veterinary hospitals.</p>

<h2>Keep a Vaccination Record</h2>
<p>Maintain a physical vaccination booklet. Many boarding facilities, groomers, and dog parks in India now require proof of vaccination. Your vet should stamp and sign the record at each visit. Keep a photocopy and photo on your phone.</p>
`,

  'tick-prevention-dogs-india': `
<p>Ticks are year-round problem in India — not just a monsoon issue. The Brown Dog Tick (Rhipicephalus sanguineus), the most common species in Indian urban environments, thrives in dry conditions as well. Tick fever from Ehrlichiosis or Babesiosis can be fatal without prompt treatment. Consistent prevention is essential.</p>

<h2>Understanding the Tick Life Cycle</h2>
<p>Ticks go through four stages: egg, larva, nymph, adult. All three active stages feed on blood. The Brown Dog Tick can complete its entire life cycle inside a home — carpets, sofas, curtains, and gaps in flooring all serve as harbouring spots. This is why treating just the dog is insufficient — the environment also needs attention.</p>

<h2>Tick Prevention Products: Your Options</h2>

<h3>Spot-On Treatments (Most Reliable)</h3>
<p>Applied to the skin between the shoulder blades once a month. Options available in India:</p>
<ul>
<li><strong>Frontline Plus</strong>: Kills fleas and ticks. Available at most vet clinics. ₹350–500 per dose.</li>
<li><strong>Revolution (Selamectin)</strong>: Covers ticks, fleas, mites, and heartworm. ₹600–900 per dose.</li>
<li><strong>Fipronil generics</strong>: More affordable alternatives available — ask your vet.</li>
</ul>

<h3>Tick Collars (Convenience Option)</h3>
<p>The <strong>Seresto collar</strong> provides 8 months of protection against ticks and fleas. More expensive upfront (₹3,500–5,000) but economical over the year. Effective and hands-free. Must be removed before bathing — reapply after drying.</p>

<h3>Oral Tablets (Newest Option)</h3>
<p>NexGard (monthly) and Bravecto (3-monthly) are oral chews that dogs take as a treat. Highly effective — tick must bite the dog before dying, but research shows minimal disease transmission occurs in the time before the tick is killed. Available from vet clinics.</p>

<h2>Environmental Treatment</h2>
<p>If you find multiple ticks on your dog, treat the environment:</p>
<ol>
<li>Wash all dog bedding in hot water (60°C or above)</li>
<li>Vacuum carpets, sofas, and gaps in flooring thoroughly — dispose of the vacuum bag immediately</li>
<li>Apply a tick spray (permethrin-based) to indoor surfaces — allow to dry before letting pets back in</li>
<li>In gardens: keep grass short, remove leaf litter, treat soil and grass edges with yard spray</li>
</ol>

<h2>Manual Tick Checks: After Every Walk</h2>
<p>Check these areas after outdoor time, especially during monsoon:</p>
<ul>
<li>Behind and inside the ears</li>
<li>Between the toes and under the paw pads</li>
<li>Under the collar and harness</li>
<li>Around the tail base</li>
<li>In the groin area</li>
<li>Under the "armpits" (where forelegs meet the body)</li>
</ul>

<h2>Correct Tick Removal</h2>
<p>Use fine-tipped tweezers or a tick removal hook. Grasp the tick as close to the skin surface as possible. Pull upward with steady, even pressure — do not twist or jerk. Never crush the tick with your fingers (disease transmission risk). Never use petroleum jelly, heat, or nail polish to make the tick detach. After removal, clean the bite area with rubbing alcohol and wash your hands thoroughly.</p>

<h2>Signs of Tick Fever — Act Fast</h2>
<p>Symptoms appear 1–3 weeks after a tick bite. Sudden high fever is usually the first sign, followed by lethargy and loss of appetite. Pale gums, nosebleeds, and bruising indicate severe thrombocytopenia (low platelet count) — this is a medical emergency. See a vet within 24 hours of any fever in a dog that has had tick exposure.</p>
`,

  'labrador-care-guide-india': `
<p>The Labrador Retriever is India's most popular dog breed — and for good reason. They are friendly, trainable, gentle with children, and adaptable to apartment life when properly exercised. However, raising a Lab well in India requires understanding both the breed's needs and how Indian conditions affect them.</p>

<h2>Labrador Basics</h2>
<ul>
<li>Weight: 25–36 kg (males), 20–32 kg (females)</li>
<li>Height: 55–62 cm</li>
<li>Lifespan: 10–12 years</li>
<li>Energy: High</li>
<li>Trainability: Very easy — among the most trainable breeds</li>
<li>Climate suitability: Moderate — manages Indian conditions better than thick-coated breeds, but needs heat management</li>
</ul>

<h2>The Obesity Problem: India's Most Common Lab Issue</h2>
<p>Labradors have a gene mutation (POMC gene) that makes them perpetually hungry and less able to feel satiated. Combined with India's culture of sharing food and overfeeding, obesity is by far the most common preventable health issue in Indian Labs.</p>
<p>A healthy Lab should have a visible waist when viewed from above and palpable ribs without pressing hard. If you cannot feel the ribs at all, your Lab is overweight. Overweight Labs suffer earlier and more severe hip dysplasia, have shorter lifespans, and develop diabetes and heart conditions.</p>
<p><strong>Feeding rule:</strong> Feed measured portions twice daily. No free-feeding. No table scraps. Treats count toward daily calorie intake. 25–30 kg adult Labs typically need 2.5–3 cups of dry food per day — less if neutered.</p>

<h2>Exercise: Non-Negotiable</h2>
<p>Labs need 60–90 minutes of exercise daily. A 15-minute leash walk twice a day is not sufficient for an adult Lab. Insufficient exercise leads to destructive behaviour, excessive chewing, hyperactivity, and weight gain.</p>
<p>In Indian conditions: exercise in early morning (before 8 AM) and evening (after 7 PM). Labs love water — if you have access to a clean water source, swimming is excellent exercise and avoids heat issues. Fetch and retrieve games satisfy their natural drives.</p>

<h2>Grooming: More Than You Expect</h2>
<p>Labs have a dense double coat that sheds year-round with two major shedding seasons. During shedding, daily brushing prevents fur from coating your home. Outside of shedding, twice-weekly brushing is sufficient.</p>
<p>Ear care is critical for Labs — their floppy ears trap moisture and create ideal conditions for infection. Check and clean ears weekly. Signs of infection: odour, scratching, dark discharge.</p>

<h2>Training: Start Day One</h2>
<p>Labs are among the easiest breeds to train — but they are also easily distracted by food and smells. Start training at 8 weeks. Labs respond beautifully to positive reinforcement. Use high-value treats (chicken pieces, cheese) for new skills. A food-motivated Labrador will learn anything you consistently teach.</p>
<p>Key commands to teach in the first month: sit, down, stay, come, leave it, drop it. "Leave it" and "drop it" are particularly important for a breed that will try to eat everything it encounters.</p>

<h2>Health Issues to Watch</h2>
<ul>
<li><strong>Hip Dysplasia</strong>: Very common in Labs. Ensure the puppy's parents have OFA/PennHIP certification if buying from a breeder. Maintain healthy weight — every extra kilogram dramatically worsens hip dysplasia.</li>
<li><strong>Obesity</strong>: Already covered — the most critical preventable issue.</li>
<li><strong>Ear infections</strong>: Weekly ear checks and cleaning.</li>
<li><strong>Eye conditions</strong>: Progressive Retinal Atrophy is hereditary in Labs. Annual eye checks after age 5.</li>
<li><strong>Elbow dysplasia</strong>: Common in large breeds. Avoid over-exercise until growth plates close at 12–18 months.</li>
</ul>

<h2>Is a Lab Right for You?</h2>
<p>Yes, if you have at least 90 minutes per day for exercise and enrichment, can commit to measured feeding without giving in to the begging, and have space to accommodate a large energetic dog. Labs are not ideal for owners who work 12+ hours a day without dog walkers or sitters — they develop destructive behaviour from boredom. But for active families with time to invest, the Labrador Retriever is an extraordinarily rewarding companion.</p>
`,
};

interface Post {
  id: string; title: string; slug: string; excerpt: string;
  content: string; featured_image: string; category: string;
  author: string; read_time_minutes: number; created_at: string;
}

const MOCK_POSTS: Post[] = [
  { id:'b1',  title:'Best Dog Food Brands in India for 2026',                   slug:'best-dog-food-brands-india',          excerpt:"India's top dog food brands, nutrition ratings, and matching recipes for every breed and budget.",              featured_image:'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200&q=80', category:'Nutrition', author:'PetopiaCare Experts', read_time_minutes:8,  created_at:'2026-04-01', content: FULL_CONTENT['best-dog-food-brands-india'] ?? '' },
  { id:'b2',  title:'Homemade Dog Food Recipe for Indian Dogs',                  slug:'homemade-dog-food-recipe-indian-dogs', excerpt:'Nutritious, budget-friendly dog food recipes using Indian kitchen ingredients.',                                featured_image:'https://images.unsplash.com/photo-1568572933382-74d440642117?w=1200&q=80', category:'Nutrition', author:'PetopiaCare Experts', read_time_minutes:10, created_at:'2026-04-06', content: FULL_CONTENT['homemade-dog-food-recipe-indian-dogs'] ?? '' },
  { id:'b3',  title:'Stop Dog Pulling on Leash: Training Tips That Work',        slug:'stop-dog-pulling-on-leash',           excerpt:'Turn daily walks into a calm experience with proven positive-reinforcement leash training techniques.',              featured_image:'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=1200&q=80', category:'Training',  author:'PetopiaCare Experts', read_time_minutes:7,  created_at:'2026-03-28', content: FULL_CONTENT['stop-dog-pulling-on-leash'] ?? '' },
  { id:'b4',  title:'Summer Dog Care in India: Hydration & Heat Safety',         slug:'summer-dog-care-india',               excerpt:"Keep your dog safe during India's hot months. Heatstroke prevention, hydration tips, and summer grooming.",           featured_image:'https://images.unsplash.com/photo-1537151608804-ea6f25dc1005?w=1200&q=80', category:'Health',    author:'PetopiaCare Experts', read_time_minutes:8,  created_at:'2026-03-20', content: FULL_CONTENT['summer-dog-care-india'] ?? '' },
  { id:'b5',  title:'How to Choose the Right Dog Harness',                       slug:'choosing-safe-dog-harness',           excerpt:'A complete buying guide — comparing no-pull, padded, and polymer harnesses for Indian breeds.',                       featured_image:'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1200&q=80', category:'Products',  author:'PetopiaCare Experts', read_time_minutes:6,  created_at:'2026-03-14', content: FULL_CONTENT['choosing-safe-dog-harness'] ?? '' },
  { id:'b6',  title:'Dog Grooming Guide for Indian Breeds',                      slug:'grooming-tips-indian-dogs',           excerpt:'Coat care, nail trimming, ear cleaning and skin health routines tailored for Indian weather and breeds.',               featured_image:'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1200&q=80', category:'Grooming',  author:'PetopiaCare Experts', read_time_minutes:7,  created_at:'2026-03-10', content: FULL_CONTENT['grooming-tips-indian-dogs'] ?? '' },
  { id:'b7',  title:'Puppy Training Basics Every New Owner Needs',               slug:'puppy-training-basics',               excerpt:'Start your puppy right — house training, socialisation, bite inhibition, and reward-based first commands.',              featured_image:'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80', category:'Training',  author:'PetopiaCare Experts', read_time_minutes:9,  created_at:'2026-03-05', content: FULL_CONTENT['puppy-training-basics'] ?? '' },
  { id:'b8',  title:'Common Dog Health Issues in India & When to See a Vet',     slug:'common-dog-health-issues',            excerpt:"Tick fever, mange, parvovirus and more — symptoms to watch for and when it's a vet emergency.",                      featured_image:'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=80', category:'Health',    author:'Dr. Priya Sharma',     read_time_minutes:10, created_at:'2026-02-28', content: FULL_CONTENT['common-dog-health-issues'] ?? '' },
  { id:'b9',  title:'Indian Pariah Dog: The Complete Breed Guide',               slug:'indian-pariah-dog-guide',             excerpt:'Everything about the Desi dog — temperament, care, training, and why adopting an INDog is the best decision.',         featured_image:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80', category:'Breeds',    author:'PetopiaCare Experts', read_time_minutes:9,  created_at:'2026-02-20', content: FULL_CONTENT['indian-pariah-dog-guide'] ?? '' },
  { id:'b10', title:'Vaccination Schedule for Dogs in India — 2026 Guide',       slug:'dog-vaccination-schedule-india',      excerpt:'Core vaccines, timing, cost, and what to expect — the complete guide for Indian dog owners.',                         featured_image:'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1200&q=80', category:'Health',    author:'Dr. Priya Sharma',     read_time_minutes:8,  created_at:'2026-02-15', content: FULL_CONTENT['dog-vaccination-schedule-india'] ?? '' },
  { id:'b11', title:'Tick Prevention for Dogs in India: Year-Round Guide',       slug:'tick-prevention-dogs-india',          excerpt:'Spot-on treatments, tick collars, and environmental control — comprehensive tick prevention for Indian conditions.',     featured_image:'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=1200&q=80', category:'Health',    author:'PetopiaCare Experts', read_time_minutes:7,  created_at:'2026-02-10', content: FULL_CONTENT['tick-prevention-dogs-india'] ?? '' },
  { id:'b12', title:"Labrador Retriever in India: Owner's Complete Care Guide",  slug:'labrador-care-guide-india',           excerpt:"Labs are India's most popular breed. Here's everything you need to raise one well in the Indian climate.",             featured_image:'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&q=80', category:'Breeds',    author:'PetopiaCare Experts', read_time_minutes:11, created_at:'2026-02-01', content: FULL_CONTENT['labrador-care-guide-india'] ?? '' },
];

async function getPost(slug: string): Promise<Post | null> {
  try {
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '');
    const { data } = await db.from('blog_posts').select('*').eq('slug', slug).eq('status', 'published').single();
    if (data) return data as Post;
  } catch {}
  return MOCK_POSTS.find(p => p.slug === slug) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} | PetopiaCare Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.created_at,
      authors: [post.author],
      images: post.featured_image ? [{ url: post.featured_image, width: 1200, height: 630, alt: post.title }] : [],
      url: `https://petopiacare.in/blog/${post.slug}`,
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt, images: post.featured_image ? [post.featured_image] : [] },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  Nutrition:'bg-green-100 text-green-700', Training:'bg-amber-100 text-amber-700',
  Health:'bg-rose-100 text-rose-700', Products:'bg-primary-100 text-primary-700',
  Grooming:'bg-purple-100 text-purple-700', Breeds:'bg-blue-100 text-blue-700',
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const aLD = articleLD({ title: post.title, excerpt: post.excerpt, image: post.featured_image, author: post.author, datePublished: post.created_at, url: `/blog/${post.slug}`, category: post.category });
  const bLD = breadcrumbLD([{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title }]);
  const related = MOCK_POSTS.filter(p => p.slug !== slug && p.category === post.category).slice(0, 3);

  return (
    <>
      <JsonLd data={[aLD, bLD]} />
      <article className="bg-white min-h-screen">
        {/* Hero image */}
        <div className="w-full h-72 md:h-[480px] relative overflow-hidden bg-neutral-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-body-sm mb-4 transition-colors">
              <ArrowLeft size={14} /> Back to Blog
            </Link>
            <span className={`inline-block text-label-sm font-semibold px-2.5 py-1 rounded-full mb-3 ${CATEGORY_COLORS[post.category] ?? 'bg-neutral-100 text-neutral-600'}`}>
              {post.category}
            </span>
            <h1 className="font-display font-bold text-display-sm md:text-display-md text-white leading-tight">{post.title}</h1>
          </div>
        </div>

        {/* Meta bar */}
        <div className="border-b border-neutral-100 bg-neutral-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-5 text-label-sm text-neutral-500">
            <span className="flex items-center gap-1.5"><User size={13} /> {post.author}</span>
            <span className="flex items-center gap-1.5"><Calendar size={13} /> {new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="flex items-center gap-1.5"><Clock size={13} /> {post.read_time_minutes} min read</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          {/* Excerpt lead */}
          <p className="text-body-lg text-neutral-600 leading-relaxed mb-8 font-medium border-l-4 border-primary-400 pl-5 italic">{post.excerpt}</p>

          {/* Article content */}
          <div
            className="prose prose-neutral max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-display-sm prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-heading-lg prose-h3:mt-6 prose-h3:mb-3 prose-p:text-body-md prose-p:leading-relaxed prose-p:text-neutral-700 prose-li:text-body-md prose-li:text-neutral-700 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-neutral-900 prose-ol:space-y-2 prose-ul:space-y-2"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 md:p-8 text-white flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <p className="font-display font-bold text-heading-lg mb-1">Shop premium dog gear</p>
              <p className="text-primary-100 text-body-sm">Harnesses, leashes, and collars built for Indian dogs</p>
            </div>
            <Link href="/products" className="flex-shrink-0 bg-white text-primary-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors text-body-sm flex items-center gap-2">
              Browse Products <ArrowRight size={14} />
            </Link>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <section className="mt-14">
              <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {related.map(r => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} className="group bg-neutral-50 border border-neutral-100 rounded-2xl overflow-hidden hover:shadow-md transition-all">
                    <div className="h-36 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.featured_image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-neutral-900 text-body-sm line-clamp-2 group-hover:text-primary-600 transition-colors">{r.title}</p>
                      <p className="text-label-sm text-neutral-400 mt-1 flex items-center gap-1"><Clock size={11} /> {r.read_time_minutes} min</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
