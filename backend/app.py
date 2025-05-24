# from flask import Flask, request, send_file
# from rembg import remove
# from PIL import Image
# import io

# app = Flask(__name__)

# @app.route('/remove-bg', methods=['POST'])
# def remove_bg():
#     try:
#         if 'image' not in request.files:
#             print("❌ No image uploaded")
#             return {'error': 'No image uploaded'}, 400

#         image_file = request.files['image']
#         print(f"📤 Received image: {image_file.filename}")

#         input_image = Image.open(image_file.stream)
#         print("🔄 Processing background removal...")

#         output = remove(input_image)
#         img_byte_arr = io.BytesIO()
#         output.save(img_byte_arr, format='PNG')
#         img_byte_arr.seek(0)

#         print("✅ Background removal completed successfully.")
#         return send_file(img_byte_arr, mimetype='image/png')
    
#     except Exception as e:
#         print(f"⚠️ Error processing image: {str(e)}")
#         return {'error': 'Internal server error'}, 500

# if __name__ == '__main__':
#     app.run(port=5001, debug=True)
from flask import Flask, request, send_file
from rembg import remove
from PIL import Image, ImageEnhance, ImageFilter
import io
import os

# Set better model
os.environ["U2NET_MODEL_NAME"] = "isnet-general-use"

app = Flask(__name__)

@app.route('/remove-bg', methods=['POST'])
def remove_bg():
    try:
        print("📥 Incoming files:", request.files)
        print("📥 Incoming form:", request.form)

        if 'image' not in request.files:
            print("❌ No image uploaded")
            return {'error': 'No image uploaded'}, 400

        image_file = request.files['image']
        print(f"📤 Received image: {image_file.filename}")

        # ✅ Open the image
        # input_image = Image.open(image_file.stream)

        # # ✅ Enhance for better edge detection
        # input_image = ImageEnhance.Contrast(input_image).enhance(1.5)
        # input_image = input_image.filter(ImageFilter.SHARPEN)

        # print("🔄 Processing with isnet-general-use model...")

        # # ✅ Background removal
        # output = remove(input_image)
        input_image = Image.open(image_file.stream)
        print("🔄 Processing with isnet-general-use model...")

        output = remove(input_image)

        img_byte_arr = io.BytesIO()
        output.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)

        print("✅ Background removal completed.")
        return send_file(img_byte_arr, mimetype='image/png')

    except Exception as e:
        print(f"⚠️ Error: {str(e)}")
        return {'error': 'Internal server error'}, 500
if __name__ == '__main__':
    app.run(port=5001, debug=True)