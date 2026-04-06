import 'dart:convert';

class SalarySlipForm {
  SalarySlipForm({
    this.companyName = '',
    this.companyAddress = '',
    this.companyCity = '',
    this.companyState = '',
    this.companyPhone = '',
    this.companyEmail = '',
    this.employeeName = '',
    this.employeeId = '',
    this.designation = '',
    this.department = '',
    this.panNumber = '',
    this.pfNumber = '',
    this.bankName = '',
    this.accountNumber = '',
    this.ifscCode = '',
    this.joiningDate = '',
    this.month = '',
    this.year = '',
    this.paymentDate = '',
    this.basic = '',
    this.hra = '',
    this.da = '',
    this.conveyance = '',
    this.medical = '',
    this.otherAllowances = '',
    this.incomeTax = '',
    this.otherDeductions = '',
    this.workingDays = '26',
    this.paidDays = '26',
  });

  String companyName;
  String companyAddress;
  String companyCity;
  String companyState;
  String companyPhone;
  String companyEmail;
  String employeeName;
  String employeeId;
  String designation;
  String department;
  String panNumber;
  String pfNumber;
  String bankName;
  String accountNumber;
  String ifscCode;
  String joiningDate;
  String month;
  String year;
  String paymentDate;
  String basic;
  String hra;
  String da;
  String conveyance;
  String medical;
  String otherAllowances;
  String incomeTax;
  String otherDeductions;
  String workingDays;
  String paidDays;

  double _d(String v) => double.tryParse(v.replaceAll(',', '')) ?? 0;

  double get grossEarnings =>
      _d(basic) + _d(hra) + _d(da) + _d(conveyance) + _d(medical) + _d(otherAllowances);
  double get totalDeductions => _d(incomeTax) + _d(otherDeductions);
  double get netPay => grossEarnings - totalDeductions;

  Map<String, dynamic> toJson() => {
        'companyName': companyName,
        'companyAddress': companyAddress,
        'companyCity': companyCity,
        'companyState': companyState,
        'companyPhone': companyPhone,
        'companyEmail': companyEmail,
        'employeeName': employeeName,
        'employeeId': employeeId,
        'designation': designation,
        'department': department,
        'panNumber': panNumber,
        'pfNumber': pfNumber,
        'bankName': bankName,
        'accountNumber': accountNumber,
        'ifscCode': ifscCode,
        'joiningDate': joiningDate,
        'month': month,
        'year': year,
        'paymentDate': paymentDate,
        'basic': basic,
        'hra': hra,
        'da': da,
        'conveyance': conveyance,
        'medical': medical,
        'otherAllowances': otherAllowances,
        'incomeTax': incomeTax,
        'otherDeductions': otherDeductions,
        'workingDays': workingDays,
        'paidDays': paidDays,
      };

  String toJsonString() => jsonEncode(toJson());

  factory SalarySlipForm.fromJson(Map<String, dynamic> j) {
    String s(String k) => j[k] as String? ?? '';
    return SalarySlipForm(
      companyName: s('companyName'),
      companyAddress: s('companyAddress'),
      companyCity: s('companyCity'),
      companyState: s('companyState'),
      companyPhone: s('companyPhone'),
      companyEmail: s('companyEmail'),
      employeeName: s('employeeName'),
      employeeId: s('employeeId'),
      designation: s('designation'),
      department: s('department'),
      panNumber: s('panNumber'),
      pfNumber: s('pfNumber'),
      bankName: s('bankName'),
      accountNumber: s('accountNumber'),
      ifscCode: s('ifscCode'),
      joiningDate: s('joiningDate'),
      month: s('month'),
      year: s('year'),
      paymentDate: s('paymentDate'),
      basic: s('basic'),
      hra: s('hra'),
      da: s('da'),
      conveyance: s('conveyance'),
      medical: s('medical'),
      otherAllowances: s('otherAllowances'),
      incomeTax: s('incomeTax'),
      otherDeductions: s('otherDeductions'),
      workingDays: s('workingDays').isEmpty ? '26' : s('workingDays'),
      paidDays: s('paidDays').isEmpty ? '26' : s('paidDays'),
    );
  }

  factory SalarySlipForm.fromJsonString(String s) =>
      SalarySlipForm.fromJson(jsonDecode(s) as Map<String, dynamic>);
}
