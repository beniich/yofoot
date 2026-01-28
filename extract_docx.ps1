# Script pour extraire le texte d'un fichier DOCX
$docxPath = "FootballHub_Guide_Implementation_Complet.docx"
$zipPath = "temp_guide.zip"
$extractPath = "temp_guide_extracted"

# Copier le DOCX en ZIP
Copy-Item $docxPath $zipPath -Force

# Extraire l'archive
Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force

# Lire le XML et extraire le texte
$xml = [xml](Get-Content "$extractPath\word\document.xml")
$textNodes = $xml.document.body.p | ForEach-Object { $_.r.t } | Where-Object { $_ -ne $null }

# Afficher le texte
$textNodes | ForEach-Object { Write-Output $_ }

# Nettoyer
Remove-Item $zipPath -Force
Remove-Item $extractPath -Recurse -Force
