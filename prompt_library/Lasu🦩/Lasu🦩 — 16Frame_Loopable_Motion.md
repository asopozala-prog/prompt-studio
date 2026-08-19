# Lasu 🦩 — 16-Frame Loopable Persona Motion Sheet

You are Lasu 🦩, the visual maker of the Mushroom House AI Studio.

Create one sprite sheet for loopable amination frames.


Preserve the persona's established identity exactly.

## 1. Canvas & Grid

Create one `2048 × 2048 px` transparent PNG.

Divide it into exactly `4 × 4` equal frames.

Each frame is exactly `512 × 512 px`.

Frame order:

01 | 02 | 03 | 04
05 | 06 | 07 | 08
09 | 10 | 11 | 12
13 | 14 | 15 | 16

Read left → right, top → bottom.

Every frame must be recoverable by exact 512 × 512 pixel cropping.

## 2. Transparent Cells

The background must be fully transparent in every frame.


Each cell contains only the persona and any object genuinely required by the motion.

## 3. Persona Consistency — CRITICAL

All 16 frames depict the exact same persona.

Only features required by the motion may change.

## 4. Position & Safe Area

Treat every 512 × 512 cell as the same local coordinate space.

Keep the persona at a consistent visual scale and anchor position.

The complete visible persona must remain clearly inside its own cell.

Leave clear transparent padding around the complete figure.


## 5. Loopable Motion — CRITICAL

Frames 01 → 16 form ONE continuous cyclic animated motion 

The transition:

**Frame 16 → Frame 01**

is equally important as every other frame transition.

Design the motion as a closed cycle.



## 6. Motion Design

Interpret the requested action as a natural repeating animation cycle. 



## 7. Mushroom House Visual Language

keep the given style but vectorizable. 

## 8. Input

**Persona:**  
as the center charactor in given image, ignore the background 

**Loopable motion:**  
[FLYING / WALKING / WAVING / PLAYING / OTHER]

**Motion character:**  
[OPTIONAL — e.g. cheerful, sleepy, cautious, energetic]

Preserve the supplied persona's individual personality while performing the motion.

## 9. Output

Output ONE `2048 × 2048 px` transparent PNG sprite sheet only.

Exactly 16 frames.
Exactly 4 × 4.
Exactly 512 × 512 px per frame.


Treat every `512 × 512 px` cell as an independent square frame.

Keep the COMPLETE persona clearly inside its own cell.



No text, labels, numbers, borders, or visible grid on the image.

After exact slicing, every cell must contain one complete transparent-background animation frame.

Priority:

persona identity
→ natural animation and 16→01 loop
→ frame containment
→ spatial consistency
→ motion clarity
→ Mushroom House visual language
→ beauty