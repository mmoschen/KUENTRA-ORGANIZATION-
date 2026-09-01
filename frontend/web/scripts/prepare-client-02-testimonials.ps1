param(
  [string]$SourceDirectory = (Join-Path $PSScriptRoot "../../../docs/testimonios"),
  [string]$DestinationDirectory = (Join-Path $PSScriptRoot "../public/testimonials/cliente-02")
)

Add-Type -AssemblyName System.Drawing

$canvasWidth = 941
$canvasHeight = 1672
$margin = 34
$headerHeight = 58
$chatTop = 94
$gap = 18
$wallpaperColor = [System.Drawing.ColorTranslator]::FromHtml("#0b141a")
$redactionColor = [System.Drawing.ColorTranslator]::FromHtml("#050708")

function Set-GraphicsQuality([System.Drawing.Graphics]$graphics) {
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
}

function Add-Redaction(
  [System.Drawing.Bitmap]$bitmap,
  [int]$x,
  [int]$y,
  [int]$width,
  [int]$height
) {
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $brush = [System.Drawing.SolidBrush]::new($redactionColor)
  $graphics.FillRectangle($brush, $x, $y, $width, $height)
  $brush.Dispose()
  $graphics.Dispose()
}

function New-Canvas(
  [System.Drawing.Bitmap]$headerSource,
  [System.Drawing.Bitmap]$wallpaperSource
) {
  $canvas = [System.Drawing.Bitmap]::new($canvasWidth, $canvasHeight)
  $graphics = [System.Drawing.Graphics]::FromImage($canvas)
  Set-GraphicsQuality $graphics
  $graphics.Clear($wallpaperColor)

  $wallpaperTile = $wallpaperSource.Clone(
    [System.Drawing.Rectangle]::new(290, 330, 270, 270),
    [System.Drawing.Imaging.PixelFormat]::Format24bppRgb
  )
  $texture = [System.Drawing.TextureBrush]::new($wallpaperTile, [System.Drawing.Drawing2D.WrapMode]::Tile)
  $graphics.FillRectangle($texture, 0, $headerHeight, $canvasWidth, $canvasHeight - $headerHeight)
  $texture.Dispose()
  $wallpaperTile.Dispose()

  $graphics.DrawImage(
    $headerSource,
    [System.Drawing.Rectangle]::new(0, 0, $canvasWidth, $headerHeight),
    [System.Drawing.Rectangle]::new(0, 0, $headerSource.Width, 56),
    [System.Drawing.GraphicsUnit]::Pixel
  )
  $graphics.Dispose()
  return $canvas
}

function Add-Regions(
  [System.Drawing.Bitmap]$canvas,
  [System.Drawing.Bitmap]$source,
  [array]$regions,
  [int]$startY = $chatTop,
  [int]$maximumGap = 90
) {
  $graphics = [System.Drawing.Graphics]::FromImage($canvas)
  Set-GraphicsQuality $graphics
  $preparedRegions = @()
  $totalHeight = 0

  foreach ($region in $regions) {
    $maxScale = ($canvasWidth - (2 * $margin)) / $region.w
    $scale = [Math]::Min([double]$region.scale, $maxScale)
    $targetWidth = [int][Math]::Round($region.w * $scale)
    $targetHeight = [int][Math]::Round($region.h * $scale)
    $targetX = if ($region.side -eq "right") { $canvasWidth - $margin - $targetWidth } else { $margin }
    $preparedRegions += [PSCustomObject]@{
      SourceRect = [System.Drawing.Rectangle]::new($region.x, $region.y, $region.w, $region.h)
      TargetWidth = $targetWidth
      TargetHeight = $targetHeight
      TargetX = $targetX
    }
    $totalHeight += $targetHeight
  }

  $availableGapSpace = $canvasHeight - $startY - $margin - $totalHeight
  $calculatedGap = if ($preparedRegions.Count -gt 1) {
    [int][Math]::Floor($availableGapSpace / ($preparedRegions.Count - 1))
  } else {
    0
  }
  $effectiveGap = [Math]::Max($gap, [Math]::Min($maximumGap, $calculatedGap))
  $cursorY = $startY

  foreach ($prepared in $preparedRegions) {
    $graphics.DrawImage(
      $source,
      [System.Drawing.Rectangle]::new($prepared.TargetX, $cursorY, $prepared.TargetWidth, $prepared.TargetHeight),
      $prepared.SourceRect,
      [System.Drawing.GraphicsUnit]::Pixel
    )
    $cursorY += $prepared.TargetHeight + $effectiveGap
  }

  $graphics.Dispose()
}

function Save-Png([System.Drawing.Bitmap]$bitmap, [string]$path) {
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
}

New-Item -ItemType Directory -Path $DestinationDirectory -Force | Out-Null

$source96 = [System.Drawing.Bitmap]::new((Join-Path $SourceDirectory "Screenshot_96.jpg"))
$source97 = [System.Drawing.Bitmap]::new((Join-Path $SourceDirectory "Screenshot_97.jpg"))
$source99 = [System.Drawing.Bitmap]::new((Join-Path $SourceDirectory "Screenshot_99.jpg"))

# Encabezado anónimo: se reemplazan foto y nombre por una identidad genérica.
$headerGraphics = [System.Drawing.Graphics]::FromImage($source96)
Set-GraphicsQuality $headerGraphics
$headerBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#111719"))
$headerGraphics.FillRectangle($headerBrush, 0, 0, 255, 56)
$avatarBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#9aa3aa"))
$avatarDetailBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#edf1f3"))
$headerGraphics.FillEllipse($avatarBrush, 12, 5, 44, 44)
$headerGraphics.FillEllipse($avatarDetailBrush, 27, 13, 14, 14)
$headerGraphics.FillEllipse($avatarDetailBrush, 20, 28, 28, 17)
$headerFont = [System.Drawing.Font]::new("Arial", 16, [System.Drawing.FontStyle]::Bold)
$headerTextBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
$headerGraphics.DrawString("Cliente verificado", $headerFont, $headerTextBrush, 65, 16)
$headerTextBrush.Dispose()
$headerFont.Dispose()
$avatarDetailBrush.Dispose()
$avatarBrush.Dispose()
$headerBrush.Dispose()
$headerGraphics.Dispose()

# Precios de la primera parte.
Add-Redaction $source96 1003 535 47 19
Add-Redaction $source96 990 572 48 19
Add-Redaction $source96 353 716 93 18

# Credenciales, nombre citado y código de acceso.
Add-Redaction $source97 838 137 224 28
Add-Redaction $source97 894 170 181 29
Add-Redaction $source97 949 437 118 24
Add-Redaction $source97 953 524 97 28

$slide1 = New-Canvas $source96 $source96
Add-Regions $slide1 $source96 @(
  @{ x = 52;  y = 186; w = 515; h = 78; side = "left";  scale = 1.25 },
  @{ x = 716; y = 271; w = 419; h = 42; side = "right"; scale = 1.25 },
  @{ x = 53;  y = 315; w = 174; h = 42; side = "left";  scale = 1.25 },
  @{ x = 704; y = 362; w = 433; h = 83; side = "right"; scale = 1.25 },
  @{ x = 53;  y = 441; w = 173; h = 44; side = "left";  scale = 1.25 },
  @{ x = 509; y = 490; w = 630; h = 187; side = "right"; scale = 1.22 },
  @{ x = 52;  y = 681; w = 518; h = 96; side = "left";  scale = 1.25 },
  @{ x = 846; y = 783; w = 293; h = 79; side = "right"; scale = 1.25 },
  @{ x = 53;  y = 861; w = 120; h = 46; side = "left";  scale = 1.25 }
)
Save-Png $slide1 (Join-Path $DestinationDirectory "01.png")

$slide2 = New-Canvas $source96 $source96
Add-Regions $slide2 $source97 @(
  @{ x = 579; y = 8;   w = 527; h = 44;  side = "right"; scale = 1.25 },
  @{ x = 33;  y = 50;  w = 111; h = 45;  side = "left";  scale = 1.25 },
  @{ x = 612; y = 99;  w = 496; h = 186; side = "right"; scale = 1.25 },
  @{ x = 32;  y = 288; w = 397; h = 132; side = "left";  scale = 1.25 },
  @{ x = 938; y = 431; w = 171; h = 132; side = "right"; scale = 1.45 },
  @{ x = 32;  y = 564; w = 500; h = 45;  side = "left";  scale = 1.25 },
  @{ x = 632; y = 612; w = 477; h = 47;  side = "right"; scale = 1.25 },
  @{ x = 32;  y = 669; w = 400; h = 99;  side = "left";  scale = 1.25 },
  @{ x = 816; y = 781; w = 292; h = 40;  side = "right"; scale = 1.25 }
)
Save-Png $slide2 (Join-Path $DestinationDirectory "02.png")

# La tercera captura ya está anonimizada y contiene la secuencia validada por el cliente.
[System.IO.File]::Copy(
  (Join-Path $SourceDirectory "ChatGPT Image 1 sept 2026, 11_02_37 (3).png"),
  (Join-Path $DestinationDirectory "03.png"),
  $true
)

$slide4 = New-Canvas $source96 $source96
Add-Regions $slide4 $source99 @(
  @{ x = 47;  y = 0;   w = 345; h = 30;  side = "left";  scale = 2.2 },
  @{ x = 776; y = 36;  w = 343; h = 219; side = "right"; scale = 2.2 },
  @{ x = 805; y = 250; w = 315; h = 116; side = "right"; scale = 2.2 },
  @{ x = 46;  y = 379; w = 135; h = 30;  side = "left";  scale = 2.2 }
) 150 120
Save-Png $slide4 (Join-Path $DestinationDirectory "04.png")

$source96.Dispose()
$source97.Dispose()
$source99.Dispose()
