Add-Type -AssemblyName System.Drawing

$size = 256
$sourcePath = Join-Path $PSScriptRoot '..\public\assets\alpendre-chimp-a.png'
$sourceImage = [System.Drawing.Image]::FromFile($sourcePath)
$bitmap = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.Clear([System.Drawing.Color]::Transparent)
$graphics.DrawImage($sourceImage, 0, 0, $size, $size)

$assetsDirectory = Join-Path $PSScriptRoot 'assets'
New-Item -ItemType Directory -Path $assetsDirectory -Force | Out-Null
$pngPath = Join-Path $assetsDirectory 'alpendre.png'
$icoPath = Join-Path $assetsDirectory 'alpendre.ico'
$bitmap.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$sourceImage.Dispose()
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
