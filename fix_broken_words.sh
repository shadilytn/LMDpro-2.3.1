#!/bin/bash
# Mapping of broken words (red -> cyan) back to original
# This script targets specific broken strings to avoid messing with legitimate cyan classes

declare -A mapping
mapping["shacyan"]="shared"
mapping["Shacyan"]="Shared"
mapping["cyanuced"]="reduced"
mapping["Cyanuced"]="Reduced"
mapping["ccyanential"]="credential"
mapping["Ccyanential"]="Credential"
mapping["ccyanentials"]="credentials"
mapping["Ccyanentials"]="Credentials"
mapping["acccyanited"]="accredited"
mapping["Acccyanited"]="Accredited"
mapping["expicyan"]="expired"
mapping["Expicyan"]="Expired"
mapping["stocyan"]="stored"
mapping["Stocyan"]="Stored"
mapping["cleacyan"]="cleared"
mapping["Cleacyan"]="Cleared"
mapping["configucyan"]="configured"
mapping["Configucyan"]="Configured"
mapping["cyanundant"]="redundant"
mapping["Cyanundant"]="Redundant"
mapping["filtecyan"]="filtered"
mapping["Filtecyan"]="Filtered"
mapping["requicyan"]="required"
mapping["Requicyan"]="Required"
mapping["scocyan"]="scored"
mapping["Scocyan"]="Scored"
mapping["mastecyan"]="mastered"
mapping["Mastecyan"]="Mastered"
mapping["structucyan"]="structured"
mapping["Structucyan"]="Structured"
mapping["discovecyan"]="discovered"
mapping["Discovecyan"]="Discovered"
mapping["pcyanict"]="predict"
mapping["Pcyanict"]="Predict"
mapping["pcyanictive"]="predictive"
mapping["Pcyanictive"]="Predictive"
mapping["pcyanictor"]="predictor"
mapping["Pcyanictor"]="Predictor"
mapping["pcyanictors"]="predictors"
mapping["Pcyanictors"]="Predictors"
mapping["cyanuction"]="reduction"
mapping["Cyanuction"]="Reduction"
mapping["buffecyan"]="buffered"
mapping["Buffecyan"]="Buffered"
mapping["ordecyan"]="ordered"
mapping["Ordecyan"]="Ordered"
mapping["anchocyan"]="anchored"
mapping["Anchocyan"]="Anchored"
mapping["prefercyan"]="preferred"
mapping["Prefercyan"]="Preferred"
mapping["registecyan"]="registered"
mapping["Registecyan"]="Registered"
mapping["secucyan"]="secured"
mapping["Secucyan"]="Secured"
mapping["measucyan"]="measured"
mapping["Measucyan"]="Measured"
mapping["ensucyan"]="ensured"
mapping["Ensucyan"]="Ensured"
mapping["explocyan"]="explored"
mapping["Explocyan"]="Explored"
mapping["prepacyan"]="prepared"
mapping["Prepacyan"]="Prepared"
mapping["cyanucing"]="reducing"
mapping["inccyanible"]="incredible"
mapping["ingcyanients"]="ingredients"
mapping["colocyan"]="colored"
mapping["reordecyan"]="reordered"
mapping["Reordecyan"]="Reordered"
mapping["tailocyan"]="tailored"
mapping["Tailocyan"]="Tailored"
mapping["acccyanitation"]="accreditation"
mapping["Acccyanitation"]="Accreditation"
mapping["miccyanrvices"]="microservices"
mapping["Miccyanrvices"]="Microservices"
mapping["tiecyan"]="tiered"
mapping["Tiecyan"]="Tiered"
mapping["powecyan"]="powered"
mapping["Powecyan"]="Powered"
mapping["centecyan"]="centered"
mapping["Centecyan"]="Centered"
mapping["delivecyan"]="delivered"
mapping["Delivecyan"]="Delivered"
mapping["answecyan"]="answered"
mapping["Answecyan"]="Answered"
mapping["encountecyan"]="encountered"
mapping["Encountecyan"]="Encountered"
mapping["prefecyan"]="preferred"
mapping["Prefecyan"]="Preferred"
mapping["triggecyan"]="triggered"
mapping["Triggecyan"]="Triggered"
mapping["gathecyan"]="gathered"
mapping["Gathecyan"]="Gathered"
mapping["precyanicted"]="predicted"
mapping["Precyanicted"]="Predicted"
mapping["offecyan"]="offered"
mapping["Offecyan"]="Offered"
mapping["cluttecyan"]="cluttered"
mapping["compacyan"]="compared"
mapping["Compacyan"]="Compared"
mapping["refactocyan"]="refactored"
mapping["Refactocyan"]="Refactored"
mapping["blurcyan"]="blurred"
mapping["ccyanits"]="credits"
mapping["Ccyanits"]="Credits"
mapping["sccyan"]="scored"
mapping["Sccyan"]="Scored"
mapping["cyanuce"]="reduce"
mapping["Cyanuce"]="Reduce"
mapping["adhecyan"]="adhered"
mapping["Adhecyan"]="Adhered"
mapping["inspicyan"]="inspired"
mapping["Inspicyan"]="Inspired"
mapping["defercyan"]="deferred"
mapping["Defercyan"]="Deferred"
mapping["acccyanited"]="accredited"
mapping["Acccyanited"]="Accredited"
mapping["Ccyanencial"]="Credential"
mapping["ccyanentialId"]="credentialId"

for broken in "${!mapping[@]}"; do
    fixed="${mapping[$broken]}"
    echo "Fixing $broken -> $fixed"
    find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i "s/$broken/$fixed/g" {} +
done

# Extra manual fixes for words missed or compound
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/dbCcyanentials/dbCredentials/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/passkeyCcyanentialId/passkeyCredentialId/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/passkeyRegistecyan/passkeyRegistered/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/reordecyanLessonQueue/reorderedLessonQueue/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/reordecyanQueue/reorderedQueue/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/isDatabaseConfigucyan/isDatabaseConfigured/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/totalWarningsBuffecyan/totalWarningsBuffered/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/pcyanictAndCacheNextModules/predictAndCacheNextModules/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/purgeExpicyanOrUnselectedDocuments/purgeExpiredOrUnselectedDocuments/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/cleanExpicyanEntries/cleanExpiredEntries/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/pruneExpicyanCachedLessonMedia/pruneExpiredCachedLessonMedia/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/cache_expicyan_/cache_expired_/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/shacyanCourses/sharedCourses/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/shacyanNotes/sharedNotes/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/ShacyanPeerResource/SharedPeerResource/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/summarizeShacyanResource/summarizeSharedResource/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/zalamati_shacyan_annotations_v1/zalamati_shared_annotations_v1/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/requicyanRole/requiredRole/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/stocyanVersion/storedVersion/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/stocyanVersionStr/storedVersionStr/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/stocyanUser/storedUser/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/getStocyanPasskey/getStoredPasskey/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/allowCcyanentials/allowCredentials/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/pubKeyCcyanParams/pubKeyCredParams/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/PublicKeyCcyanential/PublicKeyCredential/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/Ccyanencial/Credential/g' {} +

echo "Final sanity check for 'cyan' appearing in non-CSS context"
grep -rE "\w*cyan\w*" src | grep -vE "(text|bg|border|from|to|ring|shadow|fill|stroke|decoration|accent|outline|caret|divide|placeholder|via)-cyan"
