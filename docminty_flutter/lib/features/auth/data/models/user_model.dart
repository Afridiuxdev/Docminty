import 'dart:convert';

enum UserPlan { free, pro, enterprise }
enum UserRole { user, admin }

class UserModel {
  const UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.plan,
    required this.role,
    required this.emailVerified,
    this.phone,
    this.website,
    this.company,
    this.gstin,
    this.address,
    this.city,
    this.avatarUrl,
    this.planExpiresAt,
    this.createdAt,
  });

  final int id;
  final String name;
  final String email;
  final UserPlan plan;
  final UserRole role;
  final bool emailVerified;
  final String? phone;
  final String? website;
  final String? company;
  final String? gstin;
  final String? address;
  final String? city;
  final String? avatarUrl;
  final DateTime? planExpiresAt;
  final DateTime? createdAt;

  bool get isPro =>
      plan == UserPlan.pro || plan == UserPlan.enterprise;
  bool get isEnterprise => plan == UserPlan.enterprise;
  bool get isAdmin => role == UserRole.admin;

  factory UserModel.fromJson(Map<String, dynamic> j) {
    return UserModel(
      id: j['id'] as int,
      name: j['name'] as String,
      email: j['email'] as String,
      plan: _parsePlan(j['plan'] as String? ?? 'FREE'),
      role: (j['role'] as String? ?? 'USER') == 'ADMIN'
          ? UserRole.admin
          : UserRole.user,
      emailVerified: j['emailVerified'] as bool? ?? false,
      phone: j['phone'] as String?,
      website: j['website'] as String?,
      company: j['company'] as String?,
      gstin: j['gstin'] as String?,
      address: j['address'] as String?,
      city: j['city'] as String?,
      avatarUrl: j['avatarUrl'] as String?,
      planExpiresAt: j['planExpiresAt'] != null
          ? DateTime.tryParse(j['planExpiresAt'] as String)
          : null,
      createdAt: j['createdAt'] != null
          ? DateTime.tryParse(j['createdAt'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'plan': plan.name.toUpperCase(),
        'role': role.name.toUpperCase(),
        'emailVerified': emailVerified,
        'phone': phone,
        'website': website,
        'company': company,
        'gstin': gstin,
        'address': address,
        'city': city,
        'avatarUrl': avatarUrl,
        'planExpiresAt': planExpiresAt?.toIso8601String(),
        'createdAt': createdAt?.toIso8601String(),
      };

  String toJsonString() => jsonEncode(toJson());
  factory UserModel.fromJsonString(String s) =>
      UserModel.fromJson(jsonDecode(s) as Map<String, dynamic>);

  UserModel copyWith({
    String? name,
    String? phone,
    String? website,
    String? company,
    String? gstin,
    String? address,
    String? city,
    String? avatarUrl,
    UserPlan? plan,
    DateTime? planExpiresAt,
  }) =>
      UserModel(
        id: id,
        name: name ?? this.name,
        email: email,
        plan: plan ?? this.plan,
        role: role,
        emailVerified: emailVerified,
        phone: phone ?? this.phone,
        website: website ?? this.website,
        company: company ?? this.company,
        gstin: gstin ?? this.gstin,
        address: address ?? this.address,
        city: city ?? this.city,
        avatarUrl: avatarUrl ?? this.avatarUrl,
        planExpiresAt: planExpiresAt ?? this.planExpiresAt,
        createdAt: createdAt,
      );

  static UserPlan _parsePlan(String s) => switch (s.toUpperCase()) {
        'PRO' || 'BUSINESS PRO' => UserPlan.pro,
        'ENTERPRISE' => UserPlan.enterprise,
        _ => UserPlan.free,
      };
}
