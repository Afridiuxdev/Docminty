import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../../data/models/user_model.dart';
import '../../data/repositories/auth_repository.dart';

// ─── Auth State ──────────────────────────────────────────────────────────────
sealed class AuthState {
  const AuthState();
}
class AuthInitial extends AuthState { const AuthInitial(); }
class AuthLoading extends AuthState { const AuthLoading(); }
class AuthAuthenticated extends AuthState {
  const AuthAuthenticated(this.user);
  final UserModel user;
}
class AuthUnauthenticated extends AuthState { const AuthUnauthenticated(); }
class AuthError extends AuthState {
  const AuthError(this.message);
  final String message;
}
class AuthOtpPending extends AuthState {
  const AuthOtpPending(this.email);
  final String email;
}

// ─── Notifier ────────────────────────────────────────────────────────────────
class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier(this._repo) : super(const AuthInitial()) {
    _init();
  }

  final AuthRepository _repo;
  final _googleSignIn = GoogleSignIn(scopes: ['email', 'profile']);

  // Check token on startup
  Future<void> _init() async {
    state = const AuthLoading();
    try {
      final hasToken = await _repo.hasValidToken();
      if (hasToken) {
        // Try to get fresh user, fall back to cache
        try {
          final user = await _repo.getMe();
          state = AuthAuthenticated(user);
        } catch (_) {
          final cached = await _repo.getCachedUser();
          if (cached != null) {
            state = AuthAuthenticated(cached);
          } else {
            state = const AuthUnauthenticated();
          }
        }
      } else {
        state = const AuthUnauthenticated();
      }
    } catch (_) {
      state = const AuthUnauthenticated();
    }
  }

  Future<void> signup({
    required String name,
    required String email,
    required String password,
    required String phone,
  }) async {
    state = const AuthLoading();
    try {
      await _repo.signup(
        name: name,
        email: email,
        password: password,
        phone: phone,
      );
      state = AuthOtpPending(email);
    } catch (e) {
      state = AuthError(e.toString());
    }
  }

  Future<void> verifyOtp({
    required String email,
    required String otp,
  }) async {
    state = const AuthLoading();
    try {
      await _repo.verifyOtp(email: email, otp: otp);
      // After OTP, navigate user to login
      state = const AuthUnauthenticated();
    } catch (e) {
      state = AuthError(e.toString());
    }
  }

  Future<void> resendOtp(String email) async {
    try {
      await _repo.resendOtp(email);
    } catch (e) {
      state = AuthError(e.toString());
    }
  }

  Future<void> login({
    required String email,
    required String password,
  }) async {
    state = const AuthLoading();
    try {
      final user = await _repo.login(email: email, password: password);
      state = AuthAuthenticated(user);
    } catch (e) {
      state = AuthError(e.toString());
    }
  }

  Future<void> loginWithGoogle() async {
    state = const AuthLoading();
    try {
      final account = await _googleSignIn.signIn();
      if (account == null) {
        state = const AuthUnauthenticated();
        return;
      }
      final auth = await account.authentication;
      final idToken = auth.idToken;
      if (idToken == null) throw Exception('Google ID token not found');

      final user = await _repo.loginWithGoogle(idToken);
      state = AuthAuthenticated(user);
    } catch (e) {
      state = AuthError(e.toString());
    }
  }

  Future<void> logout() async {
    await _repo.logout();
    await _googleSignIn.signOut();
    state = const AuthUnauthenticated();
  }

  Future<void> refreshUser() async {
    if (state is! AuthAuthenticated) return;
    try {
      final user = await _repo.getMe();
      state = AuthAuthenticated(user);
    } catch (_) {}
  }

  Future<bool> updateProfile({
    required String name,
    String? phone,
    String? website,
    String? company,
    String? gstin,
    String? address,
    String? city,
  }) async {
    try {
      final user = await _repo.updateProfile({
        'name': name,
        if (phone != null) 'phone': phone,
        if (website != null) 'website': website,
        if (company != null) 'company': company,
        if (gstin != null) 'gstin': gstin,
        if (address != null) 'address': address,
        if (city != null) 'city': city,
      });
      state = AuthAuthenticated(user);
      return true;
    } catch (_) {
      return false;
    }
  }

  /// Bypasses backend — for UI testing only. Remove before production.
  void loginAsTestUser() {
    const mockUser = UserModel(
      id: 9999,
      name: 'Test User',
      email: 'test@docminty.com',
      plan: UserPlan.pro,
      role: UserRole.user,
      emailVerified: true,
      phone: '+91 98765 43210',
      company: 'DocMinty Test Co.',
      gstin: '27AABCU9603R1ZM',
      address: '123, MG Road',
      city: 'Mumbai',
      website: 'www.docminty.com',
    );
    state = const AuthAuthenticated(mockUser);
  }

  Future<bool> uploadAvatar(File imageFile) async {
    try {
      final user = await _repo.uploadAvatar(imageFile);
      state = AuthAuthenticated(user);
      return true;
    } catch (_) {
      return false;
    }
  }

  void clearError() {
    if (state is AuthError) state = const AuthUnauthenticated();
  }
}

// ─── Providers ───────────────────────────────────────────────────────────────
final authProvider =
    StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.read(authRepositoryProvider));
});

/// Convenience: current user (null if not authenticated)
final currentUserProvider = Provider<UserModel?>((ref) {
  final s = ref.watch(authProvider);
  return s is AuthAuthenticated ? s.user : null;
});

/// Is user Pro or Enterprise?
final isProProvider = Provider<bool>((ref) {
  return ref.watch(currentUserProvider)?.isPro ?? false;
});
