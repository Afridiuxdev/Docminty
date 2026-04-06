import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../core/theme/app_theme.dart';

class ShellScreen extends StatelessWidget {
  const ShellScreen({super.key, required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;

    int _selectedIndex() {
      if (location.startsWith('/dashboard')) return 0;
      if (location.startsWith('/documents')) return 1;
      if (location.startsWith('/create')) return 2;
      if (location.startsWith('/profile')) return 3;
      return 0;
    }

    return Scaffold(
      body: child,
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: AppColors.border)),
        ),
        child: BottomNavigationBar(
          currentIndex: _selectedIndex(),
          onTap: (i) {
            switch (i) {
              case 0:
                context.go('/dashboard');
              case 1:
                context.go('/documents');
              case 2:
                context.go('/create');
              case 3:
                context.go('/profile');
            }
          },
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_rounded),
              activeIcon: Icon(Icons.home_rounded),
              label: 'Dashboard',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.folder_rounded),
              label: 'Documents',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.add_circle_rounded),
              label: 'Create',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_rounded),
              label: 'Profile',
            ),
          ],
        ),
      ),
      floatingActionButton: location == '/dashboard' || location == '/documents'
          ? FloatingActionButton(
              onPressed: () => context.push('/create'),
              backgroundColor: AppColors.secondary,
              elevation: 4,
              tooltip: 'Create document',
              child: const Icon(Icons.add_rounded, color: Colors.white),
            )
          : null,
    );
  }
}
