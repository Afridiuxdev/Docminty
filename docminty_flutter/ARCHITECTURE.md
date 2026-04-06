# DocMinty Flutter App — Architecture Guide

## Folder Structure

```
lib/
├── main.dart                        # Entry point
├── app/
│   ├── router.dart                  # GoRouter with auth guard
│   └── shell_screen.dart            # Bottom nav shell
├── core/
│   ├── api/
│   │   ├── api_client.dart          # Dio instance + provider
│   │   ├── api_constants.dart       # All endpoint paths
│   │   └── interceptors/
│   │       ├── auth_interceptor.dart   # JWT attach + refresh
│   │       └── logging_interceptor.dart
│   ├── errors/
│   │   └── app_exception.dart       # Unified exception model
│   ├── storage/
│   │   ├── secure_storage.dart      # FlutterSecureStorage provider
│   │   └── storage_keys.dart        # Key constants (match web localStorage)
│   ├── theme/
│   │   └── app_theme.dart           # Colors, typography, ThemeData
│   ├── utils/
│   │   ├── indian_states.dart       # State code ↔ name mapping
│   │   └── currency_formatter.dart  # Rs. Indian number formatting
│   └── widgets/
│       ├── app_button.dart          # Primary/Outline/Ghost/Danger buttons
│       ├── app_card.dart            # Card + StatCard
│       └── app_text_field.dart      # TextField + FormRow + FormLabel
├── features/
│   ├── auth/
│   │   ├── data/
│   │   │   ├── models/user_model.dart
│   │   │   └── repositories/auth_repository.dart
│   │   └── presentation/
│   │       ├── providers/auth_provider.dart   # AuthState sealed class + Notifier
│   │       └── screens/
│   │           ├── login_screen.dart
│   │           ├── signup_screen.dart
│   │           └── otp_screen.dart
│   ├── documents/
│   │   ├── data/
│   │   │   ├── models/document_model.dart
│   │   │   └── repositories/documents_repository.dart
│   │   └── presentation/
│   │       └── providers/documents_provider.dart
│   ├── dashboard/
│   │   └── presentation/screens/dashboard_screen.dart
│   └── invoice/
│       ├── data/models/invoice_form.dart      # Full form model + calculations
│       ├── pdf/invoice_pdf_generator.dart     # pdf package — Classic template
│       └── presentation/
│           ├── providers/invoice_provider.dart   # StateNotifier for form
│           ├── screens/invoice_screen.dart
│           └── widgets/
│               ├── invoice_form_tabs.dart       # 5-tab form (same as web)
│               └── invoice_preview_widget.dart  # Live preview widget
```

## State Management (Riverpod)

| Provider | Type | Purpose |
|----------|------|---------|
| `authProvider` | `StateNotifierProvider` | Auth state machine |
| `currentUserProvider` | `Provider` (derived) | Current user object |
| `isProProvider` | `Provider` (derived) | Plan gating |
| `documentsProvider` | `AsyncNotifierProvider` | Saved documents list |
| `invoiceFormProvider` | `StateNotifierProvider.autoDispose` | Invoice form state |
| `dioProvider` | `Provider` | Configured Dio instance |
| `secureStorageProvider` | `Provider` | FlutterSecureStorage |

## Auth Flow

```
App start → AuthInitial
  → check secure storage for access token
  → if token exists → GET /auth/me
    → success: AuthAuthenticated(user)
    → fail: try cached user → AuthAuthenticated(cachedUser)
    → no cache: AuthUnauthenticated
  → no token: AuthUnauthenticated

GoRouter redirect:
  → AuthUnauthenticated + non-public route → /login
  → AuthAuthenticated + auth route → /dashboard
```

## Adding a New Document Module

Follow the invoice module pattern:

1. `lib/features/{module}/data/models/{module}_form.dart` — Form model
2. `lib/features/{module}/presentation/providers/{module}_provider.dart` — StateNotifier
3. `lib/features/{module}/presentation/screens/{module}_screen.dart` — Screen
4. `lib/features/{module}/presentation/widgets/{module}_form_tabs.dart` — Form tabs
5. `lib/features/{module}/pdf/{module}_pdf_generator.dart` — PDF generator
6. Add route in `app/router.dart`
7. Add quick action tile in dashboard

## PDF Strategy

- Uses `pdf` + `printing` Flutter packages (client-side, no server needed)
- Each module has its own generator that mirrors the web template
- `PdfGoogleFonts` downloads Inter + Space Grotesk at first use
- Output: Share sheet → user saves to Files / shares to WhatsApp etc.

## API Base URL

Change `ApiConstants.baseUrl` per environment:
- Dev (Android emulator): `http://10.0.2.2:8080/api`
- Dev (iOS simulator): `http://127.0.0.1:8080/api`
- Dev (physical device): `http://192.168.x.x:8080/api`
- Production: `https://api.docminty.com/api`
