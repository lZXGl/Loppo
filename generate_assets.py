import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_gradient_surface(width, height, start_color, end_color):
    base = Image.new('RGBA', (width, height), start_color)
    top = Image.new('RGBA', (width, height), end_color)
    mask = Image.new('L', (width, height))
    mask_data = []
    for y in range(height):
        for x in range(width):
            # Diagonal gradient
            factor = (x / width + y / height) / 2.0
            mask_data.append(int(255 * factor))
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base

def draw_rounded_rect(draw, bbox, radius, fill):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill)

def generate_icon(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Gradient background
    pad = int(size * 0.05)
    radius = int(size * 0.22)
    
    # Create smooth background
    bg = create_gradient_surface(size, size, (15, 118, 110, 255), (56, 189, 248, 255))
    
    # Rounded mask
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([pad, pad, size - pad, size - pad], radius=radius, fill=255)
    
    img.paste(bg, (0, 0), mask)
    
    # Draw letter 'L'
    # Coordinates proportional to size
    l_x0 = int(size * 0.32)
    l_x1 = int(size * 0.46)
    l_y0 = int(size * 0.24)
    l_y1 = int(size * 0.76)
    l_x2 = int(size * 0.72)
    l_y2 = int(size * 0.62)
    
    draw = ImageDraw.Draw(img)
    # Vertical bar of L
    draw.rounded_rectangle([l_x0, l_y0, l_x1, l_y1], radius=max(2, int(size * 0.04)), fill=(255, 255, 255, 255))
    # Horizontal bar of L
    draw.rounded_rectangle([l_x0, l_y2, l_x2, l_y1], radius=max(2, int(size * 0.04)), fill=(255, 255, 255, 255))
    
    return img

def generate_og_image():
    width, height = 1200, 630
    img = Image.new('RGB', (width, height), (15, 23, 42)) # Deep slate background
    
    # Background mesh gradient effect
    bg_gradient = create_gradient_surface(width, height, (15, 23, 42, 255), (17, 24, 39, 255))
    img.paste(bg_gradient, (0, 0))
    
    # Glow orb behind logo
    orb = Image.new('RGBA', (600, 600), (0, 0, 0, 0))
    orb_draw = ImageDraw.Draw(orb)
    orb_draw.ellipse([50, 50, 550, 550], fill=(15, 118, 110, 80))
    orb = orb.filter(ImageFilter.GaussianBlur(80))
    img.paste(orb, (650, 20), orb)
    
    # Secondary cyan glow
    cyan_orb = Image.new('RGBA', (500, 500), (0, 0, 0, 0))
    cyan_draw = ImageDraw.Draw(cyan_orb)
    cyan_draw.ellipse([50, 50, 450, 450], fill=(6, 182, 212, 60))
    cyan_orb = cyan_orb.filter(ImageFilter.GaussianBlur(90))
    img.paste(cyan_orb, (-100, 150), cyan_orb)
    
    draw = ImageDraw.Draw(img)
    
    # Border stroke around the card
    draw.rounded_rectangle([20, 20, width - 20, height - 20], radius=24, outline=(51, 65, 85), width=2)
    
    # Place large branded icon
    icon = generate_icon(140)
    img.paste(icon, (100, 110), icon)
    
    # Fonts
    font_bold = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
    font_reg = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
    
    title_font = ImageFont.truetype(font_bold, 84) if os.path.exists(font_bold) else ImageFont.load_default()
    subtitle_font = ImageFont.truetype(font_bold, 36) if os.path.exists(font_bold) else ImageFont.load_default()
    tagline_font = ImageFont.truetype(font_reg, 26) if os.path.exists(font_reg) else ImageFont.load_default()
    badge_font = ImageFont.truetype(font_bold, 20) if os.path.exists(font_bold) else ImageFont.load_default()
    
    # Brand Name
    draw.text((270, 128), "Loppo", font=title_font, fill=(248, 250, 252))
    
    # Tagline / Headline
    draw.text((100, 290), "Where Communities Connect & Ideas Thrive", font=subtitle_font, fill=(255, 255, 255))
    draw.text((100, 360), "Real-time discussions, creator stories, interactive polls & tech hubs.", font=tagline_font, fill=(148, 163, 184))
    
    # Feature Badges
    badges = [
        ("🔥 Trending Discussions", (20, 184, 166)),
        ("⚡ Lightning Fast", (59, 130, 246)),
        ("🌐 Multi-Language (EN/AR)", (168, 85, 247)),
        ("🔒 Private & Secure", (245, 158, 11))
    ]
    
    cur_x = 100
    badge_y = 440
    for text, color in badges:
        # Draw pill badge
        pill_w = len(text) * 11 + 28
        draw.rounded_rectangle([cur_x, badge_y, cur_x + pill_w, badge_y + 44], radius=22, fill=(30, 41, 59), outline=color, width=2)
        draw.text((cur_x + 14, badge_y + 11), text, font=badge_font, fill=(241, 245, 249))
        cur_x += pill_w + 16
        
    # Domain Footer Bar
    draw.line([100, 535, width - 100, 535], fill=(51, 65, 85), width=1)
    domain_font = ImageFont.truetype(font_bold, 24) if os.path.exists(font_bold) else ImageFont.load_default()
    draw.text((100, 555), "loppo.com", font=domain_font, fill=(45, 212, 191))
    draw.text((width - 340, 555), "© 2026 Loppo Community Inc.", font=tagline_font, fill=(100, 116, 139))
    
    return img

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    assets_dir = os.path.join(base_dir, 'assets')
    os.makedirs(assets_dir, exist_ok=True)
    
    # 1. Favicon PNGs
    icon_32 = generate_icon(32)
    icon_32.save(os.path.join(base_dir, 'favicon-32x32.png'))
    icon_32.save(os.path.join(base_dir, 'favicon.png'))
    
    icon_192 = generate_icon(192)
    icon_192.save(os.path.join(base_dir, 'favicon-192x192.png'))
    
    icon_512 = generate_icon(512)
    icon_512.save(os.path.join(base_dir, 'favicon-512x512.png'))
    
    icon_180 = generate_icon(180)
    icon_180.save(os.path.join(base_dir, 'apple-touch-icon.png'))
    
    # 2. Favicon ICO
    # Save multi-size ICO
    icon_sizes = [generate_icon(s) for s in [16, 32, 48]]
    icon_sizes[1].save(os.path.join(base_dir, 'favicon.ico'), format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    
    # 3. Default avatar PNG
    avatar = Image.new('RGBA', (128, 128), (0, 0, 0, 0))
    av_draw = ImageDraw.Draw(avatar)
    av_draw.ellipse([0, 0, 128, 128], fill=(15, 118, 110, 255))
    # Head & shoulders icon
    av_draw.ellipse([44, 24, 84, 64], fill=(255, 255, 255, 255))
    av_draw.chord([24, 70, 104, 150], start=180, end=360, fill=(255, 255, 255, 255))
    avatar.save(os.path.join(assets_dir, 'default-avatar.png'))
    
    # 4. Social Open Graph Image
    og_img = generate_og_image()
    og_img.save(os.path.join(assets_dir, 'og-image.png'), format='PNG', quality=95)
    og_img.save(os.path.join(base_dir, 'og-image.png'), format='PNG', quality=95)
    
    print("All branding assets, favicons, and OG image generated successfully!")

if __name__ == '__main__':
    main()
