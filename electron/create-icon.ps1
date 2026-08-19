Add-Type -AssemblyName System.Drawing

$size = 256
$bitmap = New-Object System.Drawing.Bitmap($size, $size)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$bounds = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
$gradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  $bounds,
  [System.Drawing.Color]::FromArgb(177, 120, 255),
  [System.Drawing.Color]::FromArgb(92, 67, 207),
  45
)
$graphics.FillRectangle($gradient, $bounds)

$font = New-Object System.Drawing.Font('Segoe UI', 150, ([System.Drawing.FontStyle]::Bold -bor [System.Drawing.FontStyle]::Italic), [System.Drawing.GraphicsUnit]::Pixel)
$format = New-Object System.Drawing.StringFormat
$format.Alignment = [System.Drawing.StringAlignment]::Center
$format.LineAlignment = [System.Drawing.StringAlignment]::Center
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$graphics.DrawString('A', $font, $brush, (New-Object System.Drawing.RectangleF(0, -7, $size, $size)), $format)

$assetsDirectory = Join-Path $PSScriptRoot 'assets'
New-Item -ItemType Directory -Path $assetsDirectory -Force | Out-Null
$pngPath = Join-Path $assetsDirectory 'alpendre.png'
$icoPath = Join-Path $assetsDirectory 'alpendre.ico'
$bitmap.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$gradient.Dispose()
$font.Dispose()
$format.Dispose()
$brush.Dispose()
$bitmap.Dispose()

$pngBytes = [System.IO.File]::ReadAllBytes($pngPath)
$stream = [System.IO.File]::Create($icoPath)
$writer = New-Object System.IO.BinaryWriter($stream)
$writer.Write([UInt16]0)
$writer.Write([UInt16]1)
$writer.Write([UInt16]1)
$writer.Write([Byte]0)
$writer.Write([Byte]0)
$writer.Write([Byte]0)
$writer.Write([Byte]0)
$writer.Write([UInt16]1)
$writer.Write([UInt16]32)
$writer.Write([UInt32]$pngBytes.Length)
$writer.Write([UInt32]22)
$writer.Write($pngBytes)
$writer.Dispose()
$stream.Dispose()
