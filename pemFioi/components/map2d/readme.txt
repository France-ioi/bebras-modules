Grading notes (map2d.diff method)


Step 1:
Go through all user figures and check tags and names. 
If figure tag or name does not exists in target figures then produce mistake with data:
point: center of figure
type: 'extra'
attribure: 'tag' or 'name'
name: figure name
tag: figure tag

Step 2:
Collect unique pairs (tag, name) from target figures. This is layers.
For each layer:
- filter user figures by layer name and tag, draw user mask.
- filter target figures by layer name and tag, draw target mask.
Mask is bitmap, value 1 means that pixel exists, 0 - pixel not exists.

Compare both masks pixel by pixel.

If pixel exists in target mask and not exists in user mask then produce mistake with data:
point: pixel position
type: 'miss'
attribure: 'pixel'
name: layer name
tag: layer tag

If pixel exists in user mask and not exists in target mask then produce mistake with data:
point: pixel position
type: 'extra'
attribure: 'pixel'
name: layer name
tag: layer tag


mistake data avilable via getMistake() method