#!/bin/bash

# Comprehensive fix for corrupted words from accidental color replacement
# Only targeting specific corrupted tokens to avoid breaking legitimate 'cyan' accents.

declare -A mapping=(
    ["acccyaniting"]="accrediting"
    ["acquicyan"]="acquired"
    ["Acquicyan"]="Acquired"
    ["authocyan"]="authored"
    ["captucyan"]="captured"
    ["ccyanit"]="credit"
    ["Ccyanit"]="Credit"
    ["chcyan"]="chamber"
    ["conquecyan"]="conquered"
    ["Conquecyan"]="Conquered"
    ["considecyan"]="considered"
    ["covecyan"]="covered"
    ["cyanaction"]="redaction"
    ["cyanactPII"]="redactPII"
    ["cyanGlow"]="amberGlow"
    ["cyanirect"]="redirect"
    ["cyanrawing"]="redrawing"
    ["declacyan"]="declared"
    ["desicyan"]="desired"
    ["engineecyan"]="engineered"
    ["Engineecyan"]="Engineered"
    ["featucyan"]="featured"
    ["Featucyan"]="Featured"
    ["hundcyans"]="hundreds"
    ["hovecyan"]="hovered"
    ["infercyan"]="inferred"
    ["infracyan"]="infrared"
    ["isHovecyan"]="isHovered"
    ["layecyan"]="layered"
    ["Layecyan"]="Layered"
    ["Miccyancond"]="Microsecond"
    ["milcyanters"]="millimeters"
    ["mirrocyan"]="mirrored"
    ["occurcyan"]="occurred"
    ["paicyan"]="paired"
    ["pcyanatory"]="predatory"
    ["pcyanefinedTags"]="predefinedTags"
    ["refercyan"]="referred"
    ["rendecyan"]="rendered"
    ["Rendecyan"]="Rendered"
    ["shacyan"]="shared"
    ["suffecyan"]="suffered"
    ["unhindecyan"]="unhindered"
    ["clecyan"]="cleared"
    ["scyan"]="scam"
    ["acyan"]="ared"
    ["encyan"]="ered"
    ["pcyan"]="pred"
)

# Sort keys by length descending to ensure longer patterns are matched first
keys=($(for k in "${!mapping[@]}"; do echo ${#k} $k; done | sort -rn | cut -d' ' -f2))

for broken in "${keys[@]}"; do
    fixed=${mapping[$broken]}
    echo "Fixing $broken -> $fixed"
    # We use -l to only get files containing the string, then sed to replace
    grep -rl "$broken" src | xargs -r sed -i "s/$broken/$fixed/g"
done

echo "Fix complete."
