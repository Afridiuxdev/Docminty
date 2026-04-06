import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

/// Reusable "Continue with Google" button used on both Login and Signup.
class GoogleSignInButton extends StatelessWidget {
  const GoogleSignInButton({super.key, this.onTap, this.label = 'Continue with Google'});
  final VoidCallback? onTap;
  final String label;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 48,
      child: OutlinedButton(
        onPressed: onTap,
        style: OutlinedButton.styleFrom(
          side: const BorderSide(color: AppColors.border),
          foregroundColor: AppColors.textPrimary,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.md),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const _GoogleLogo(size: 20),
            const SizedBox(width: 10),
            Text(
              label,
              style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }
}

/// Draws the official Google "G" logo using the four brand colours.
class _GoogleLogo extends StatelessWidget {
  const _GoogleLogo({this.size = 20});
  final double size;

  @override
  Widget build(BuildContext context) => CustomPaint(
        size: Size(size, size),
        painter: _GoogleLogoPainter(),
      );
}

class _GoogleLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final r = size.width / 2;
    final cx = r;
    final cy = r;

    _drawArc(canvas, cx, cy, r, -12, 255, const Color(0xFF4285F4));
    _drawArc(canvas, cx, cy, r, 243, 75, const Color(0xFFEA4335));
    _drawArc(canvas, cx, cy, r, -78, -75, const Color(0xFFFBBC05));
    _drawArc(canvas, cx, cy, r, -12, -55, const Color(0xFF34A853));

    canvas.drawCircle(
      Offset(cx, cy),
      r * 0.58,
      Paint()..color = Colors.white,
    );

    final barPaint = Paint()
      ..color = const Color(0xFF4285F4)
      ..style = PaintingStyle.fill;
    final barTop = cy - r * 0.13;
    final barBottom = cy + r * 0.13;
    final barLeft = cx;
    final barRight = cx + r * 0.92;
    canvas.drawRRect(
      RRect.fromLTRBR(barLeft, barTop, barRight, barBottom,
          Radius.circular(r * 0.12)),
      barPaint,
    );
  }

  void _drawArc(Canvas canvas, double cx, double cy, double r,
      double startDeg, double sweepDeg, Color color) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = r * 0.42
      ..strokeCap = StrokeCap.butt;
    canvas.drawArc(
      Rect.fromCircle(center: Offset(cx, cy), radius: r * 0.79),
      _rad(startDeg),
      _rad(sweepDeg),
      false,
      paint,
    );
  }

  double _rad(double deg) => deg * 3.14159265 / 180;

  @override
  bool shouldRepaint(_) => false;
}
