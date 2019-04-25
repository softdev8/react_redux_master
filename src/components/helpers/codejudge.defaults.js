export default {
  'c++' : {
    testresults : {
      userCodeStringFormat: '#include <string>\r\nstruct EdTestMetadata {\r\n  std::string userCode;\r\n};\r\n\r\nEdTestMetadata edTestMetadata = {\"{0}\"};',
      authorCode: '#include <vector>\r\n#include <string>\r\n\r\nstruct TestResult {\r\n  bool succeeded;\r\n  std::string reason;\r\n  std::string input;\r\n  std::string expected_output;\r\n  std::string actual_output;\r\n};\r\n\r\nstd::vector<TestResult> executeTests() {\r\n  std::vector<int> inputs = {0, 1, 2, 5};\r\n  std::vector<int> expected_outputs = {1, 1, 2, 120};\r\n  std::vector<TestResult> results;\r\n  \r\n  for (int i = 0; i < inputs.size(); i++) {\r\n    results.emplace_back(TestResult());\r\n    auto result = &(results.back());\r\n    \r\n    result->input = \"factorial(\" + std::to_string(inputs[i]) + \")\";\r\n  \tresult->expected_output = std::to_string(expected_outputs[i]);\r\n  \t\r\n    auto actual_output = factorial(inputs[i]);\r\n    result->actual_output = std::to_string(actual_output);\r\n    \r\n    if (actual_output == expected_outputs[i]) {\r\n      result->reason = \"Succeeded\";\r\n      result->succeeded = true;\r\n    } else {\r\n      result->reason = \"Incorrect Output\";\r\n      result->succeeded = false;\r\n    }\r\n  }\r\n \r\n  return results;\r\n}\r\n',
      edCode: '#include <iostream>\r\n\r\nint main() {\r\n  std::vector<TestResult> results = executeTests();\r\n\r\n  if (results.size() == 0) {\r\n    return 0;\r\n  }\r\n\r\n  std::string output = \"<__educative_test_results__>{\\\"test_results\\\": [\";\r\n\r\n  int count = 0;\r\n  for (const TestResult& result : results) {\r\n    if (count > 0) {\r\n      output += \",\";\r\n    }\r\n    output += \"{\";\r\n    output += \"\\\"reason\\\": \\\"\" + result.reason + \"\\\",\";\r\n    output += \"\\\"input\\\": \\\"\" + result.input + \"\\\",\";\r\n    output += \"\\\"expected_output\\\": \\\"\" + result.expected_output + \"\\\",\";\r\n    output += \"\\\"actual_output\\\": \\\"\" + result.actual_output + \"\\\",\";\r\n\r\n    std::string succeededStr = result.succeeded ? \"true\" : \"false\";\r\n\r\n    output += \"\\\"succeeded\\\": \" + succeededStr + \"}\";\r\n    count++;\r\n  }\r\n\r\n\r\n  output += \"]}<\/__educative_test_results__>\";\r\n\r\n  std::cout << output;\r\n  return 0;\r\n}',
      version: '1.1'
    },
    console : {
      userCodeStringFormat: '#include <string>\r\nstruct EdTestMetadata {\r\n  std::string userCode;\r\n};\r\n\r\nEdTestMetadata edTestMetadata = {\"{0}\"};',
      authorCode: '#include <vector>\r\n#include <string>\r\n\r\nvoid beginTest();\r\nvoid endTest();\r\n\r\nstruct TestDetail {\r\n  std::string input;\r\n  std::string expected_console_regex;\r\n};\r\n\r\nstd::vector<TestDetail> executeTests() {\r\n  std::vector<int> inputs = {0, 1, 2, 5};\r\n  std::vector<int> expected_outputs = {1, 1, 2, 120};\r\n  std::vector<TestDetail> details;\r\n\r\n  for (int i = 0; i < inputs.size(); i++) {\r\n    beginTest();\r\n\r\n    details.emplace_back(TestDetail());\r\n    auto detail = &(details.back());\r\n\r\n    detail->input = \"factorial(\" + std::to_string(inputs[i]) + \")\";\r\n    detail->expected_console_regex = std::to_string(expected_outputs[i]);\r\n    factorial(inputs[i]);\r\n\r\n    endTest();\r\n  }\r\n\r\n  return details;\r\n}\r\n',
      edCode: '#include <iostream>\r\nusing namespace std;\r\n\r\nint __TEST__COUNT = 0;\r\n\r\nvoid beginTest() {\r\n  __TEST__COUNT++;\r\n  cout << \"<__TEST-OUTPUT-\" << __TEST__COUNT\r\n       << \"__>\";\r\n}\r\n\r\nvoid endTest() {\r\n  cout << \"<\/__TEST-OUTPUT-\" << __TEST__COUNT\r\n       << \"__>\"\r\n       << std::endl;\r\n}\r\n\r\nint main() {\r\n  std::vector<TestDetail> results = executeTests();\r\n\r\n  if (results.size() == 0) {\r\n    return 0;\r\n  }\r\n\r\n  std::string output = \"<__educative_test_details__>{\\\"test_details\\\": [\";\r\n\r\n  int count = 0;\r\n  for (const TestDetail& test_detail : results) {\r\n    if (count > 0) {\r\n      output += \",\";\r\n    }\r\n    output += \"{\";\r\n    output += \"\\\"input\\\": \\\"\" + test_detail.input + \"\\\",\";\r\n    output += \"\\\"expected_console_regex\\\": \\\"\" + test_detail.expected_console_regex + \"\\\"}\";\r\n    count++;\r\n  }\r\n\r\n\r\n  output += \"]}<\/__educative_test_details__>\";\r\n\r\n  std::cout << output;\r\n  return 0;\r\n}\r\n',
      version: '1.1'
    }
  },
  'c#' : {
    testresults : {
      userCodeStringFormat: 'class edTestMetadata { public const string userCode = "{0}";}',
      authorCode: 'public struct TestResult {\r\n  public bool succeeded;\r\n  public string reason;\r\n  public string input;\r\n  public string expected_output;\r\n  public string actual_output;\r\n}\r\n\r\npublic static class EdTestRunner {\r\n  public static TestResult[] executeTests() {\r\n    int[] inputs = new int[] {0, 1, 2, 5};;\r\n    int[] expected_outputs = new int[] {1, 1, 2, 120};\r\n    TestResult[] test_results = new TestResult[4];\r\n\r\n    for(int i = 0; i < inputs.Length; i++) {\r\n      test_results[i] = new TestResult();\r\n      test_results[i].input = \"factorial(\" + inputs[i].ToString() + \")\";\r\n      test_results[i].expected_output = expected_outputs[i].ToString();\r\n\r\n      int actual_output = Solution.factorial(inputs[i]);\r\n\r\n      test_results[i].actual_output = actual_output.ToString();\r\n\r\n      if (actual_output == expected_outputs[i]) {\r\n        test_results[i].reason = \"Succeeded\";\r\n        test_results[i].succeeded = true;\r\n      } else {\r\n        test_results[i].reason = \"Incorrect Output\";\r\n        test_results[i].succeeded = false;\r\n      }\r\n    }\r\n\r\n    return test_results;\r\n  }\r\n}',
      edCode: '\r\npublic class TestRunner\r\n{\r\n   public static void Main()\r\n   {\r\n     TestResult[] test_results = EdTestRunner.executeTests();\r\n     string output = \"<__educative_test_results__>{\\\"test_results\\\": [\";\r\n\r\n     int count = 0;\r\n     foreach (TestResult result in test_results) {\r\n       if (count > 0) {\r\n         output += \",\";\r\n       }\r\n       output += \"{\";\r\n       output += \"\\\"reason\\\": \\\"\" + result.reason + \"\\\",\";\r\n       output += \"\\\"input\\\": \\\"\" + result.input + \"\\\",\";\r\n       output += \"\\\"expected_output\\\": \\\"\" + result.expected_output + \"\\\",\";\r\n       output += \"\\\"actual_output\\\": \\\"\" + result.actual_output + \"\\\",\";\r\n       output += \"\\\"succeeded\\\": \" + (result.succeeded ? \"true\" : \"false\") + \"}\";\r\n       count++;\r\n     }\r\n\r\n\r\n    output += \"]}<\/__educative_test_results__>\";\r\n\r\n    System.Console.WriteLine(output);\r\n  }\r\n}\r\n',
      version: '1.1'
    },
    console : {
      userCodeStringFormat: 'class edTestMetadata { public const string userCode = "{0}";}',
      authorCode: 'public struct TestDetail {\r\n  public string input;\r\n  public string expected_console_regex;\r\n}\r\n\r\npublic static class EdTestRunner {\r\n  public static TestDetail[] executeTests() {\r\n    int[] inputs = new int[] {0, 1, 2, 5};;\r\n    int[] expected_outputs = new int[] {1, 1, 2, 120};\r\n    TestDetail[] test_details = new TestDetail[4];\r\n\r\n    for(int i = 0; i < inputs.Length; i++) {\r\n      \/\/ Required to start a test case\r\n      TestHelper.beginTest();\r\n\r\n      test_details[i] = new TestDetail();\r\n      test_details[i].input = inputs[i].ToString();\r\n      test_details[i].expected_console_regex = expected_outputs[i].ToString();\r\n\r\n      Solution.factorial(inputs[i]);\r\n\r\n      \/\/ Required to end a test case\r\n      TestHelper.endTest();\r\n    }\r\n\r\n    return test_details;\r\n  }\r\n}\r\n',
      edCode: 'public static class TestHelper {\r\n  private static int __TEST_COUNT__ = 0;\r\n\r\n  public static void beginTest() {\r\n    __TEST_COUNT__ += 1;\r\n    System.Console.WriteLine(System.String.Format(\"<__TEST-OUTPUT-{0}__>\", __TEST_COUNT__));\r\n  }\r\n\r\n  public static void endTest() {\r\n    System.Console.WriteLine(System.String.Format(\"<\/__TEST-OUTPUT-{0}__>\", __TEST_COUNT__));\r\n  }\r\n}\r\n\r\npublic class TestRunner\r\n{\r\n   public static void Main()\r\n   {\r\n     TestDetail[] test_details = EdTestRunner.executeTests();\r\n     string output = \"<__educative_test_details__>{\\\"test_details\\\": [\";\r\n\r\n     int count = 0;\r\n     foreach (TestDetail test_detail in test_details) {\r\n       if (count > 0) {\r\n         output += \",\";\r\n       }\r\n       output += \"{\";\r\n       output += \"\\\"input\\\": \\\"\" + test_detail.input + \"\\\",\";\r\n       output += \"\\\"expected_console_regex\\\": \\\"\" + test_detail.expected_console_regex + \"\\\"}\";\r\n       count++;\r\n     }\r\n\r\n\r\n    output += \"]}<\/__educative_test_details__>\";\r\n\r\n    System.Console.WriteLine(output);\r\n  }\r\n}',
      version: '1.1'
    }
  },
  java : {
    testresults : {
      userCodeStringFormat: 'class edTestMetadata { public static final String userCode = "{0}";}',
      authorCode: 'class TestResult {\r\n  public boolean succeeded;\r\n  public String reason;\r\n  public String input;\r\n  public String expected_output;\r\n  public String actual_output;\r\n}\r\n\r\nclass EdTestRunner {\r\n  public static TestResult[] executeTests() {\r\n\tint[] inputs = {0, 1, 2, 5};\r\n    int[] expected_outputs = {1, 1, 2, 120};\r\n    TestResult[] test_results = new TestResult[4];\r\n\r\n    for(int i = 0; i < inputs.length; i++) {\r\n      test_results[i] = new TestResult();\r\n      test_results[i].input = \"factorial(\" + inputs[i] + \")\";\r\n      test_results[i].expected_output = String.valueOf(expected_outputs[i]);\r\n\r\n      int actual_output = Solution.factorial(inputs[i]);\r\n\r\n      test_results[i].actual_output = String.valueOf(actual_output);\r\n\r\n      if (actual_output == expected_outputs[i]) {\r\n        test_results[i].reason = \"Succeeded\";\r\n        test_results[i].succeeded = true;\r\n      } else {\r\n        test_results[i].reason = \"Incorrect Output\";\r\n        test_results[i].succeeded = false;\r\n      }\r\n    }\r\n\r\n    return test_results;\r\n  }\r\n}',
      edCode: 'class TestRunner\r\n{\r\n   public static void main(String[] args) throws java.lang.Exception\r\n   {     \r\n\r\n     \r\n     TestResult[] test_results = EdTestRunner.executeTests();\r\n     String output = \"<__educative_test_results__>{\\\"test_results\\\": [\";\r\n\r\n     int count = 0;\r\n     for(TestResult result : test_results) {\r\n       if (count > 0) {\r\n         output += \",\";\r\n       }\r\n       output += \"{\";\r\n       output += \"\\\"reason\\\": \\\"\" + result.reason + \"\\\",\";\r\n       output += \"\\\"input\\\": \\\"\" + result.input + \"\\\",\";\r\n       output += \"\\\"expected_output\\\": \\\"\" + result.expected_output + \"\\\",\";\r\n       output += \"\\\"actual_output\\\": \\\"\" + result.actual_output + \"\\\",\";\r\n       output += \"\\\"succeeded\\\": \" + (result.succeeded ? \"true\" : \"false\") + \"}\";\r\n       count++;\r\n     }\r\n\r\n\r\n    output += \"]}<\/__educative_test_results__>\";\r\n\r\n    System.out.println(output);\r\n  }\r\n}\r\n',
      version: '1.1'
    },
    console : {
      userCodeStringFormat: 'class edTestMetadata { public static final String userCode = "{0}";}',
      authorCode: 'class TestDetail {\r\n  public String input;\r\n  public String expected_console_regex;\r\n}\r\n\r\nclass EdTestRunner {\r\n  public static TestDetail[] executeTests() {\r\n    int[] inputs = {0, 1, 2, 5};;\r\n    int[] expected_outputs = {1, 1, 2, 120};\r\n    TestDetail[] test_details = new TestDetail[4];\r\n\r\n    for(int i = 0; i < inputs.length; i++) {\r\n      \/\/ Required to start a test case\r\n      TestHelper.beginTest();\r\n\r\n      test_details[i] = new TestDetail();\r\n      test_details[i].input = String.valueOf(inputs[i]);\r\n      test_details[i].expected_console_regex = String.valueOf(expected_outputs[i]);\r\n\r\n      Solution.factorial(inputs[i]);\r\n\r\n      \/\/ Required to end a test case\r\n      TestHelper.endTest();\r\n    }\r\n\r\n    return test_details;\r\n  }\r\n}\r\n\r\nclass TestHelper {\r\n  private static int __TEST_COUNT__ = 0;\r\n\r\n  public static void beginTest() {\r\n    __TEST_COUNT__ += 1;\r\n    System.out.format(\"<__TEST-OUTPUT-%d__>\", __TEST_COUNT__);\r\n  }\r\n\r\n  public static void endTest() {\r\n    System.out.format(\"<\/__TEST-OUTPUT-%d__>\", __TEST_COUNT__);\r\n  }\r\n}',
      edCode: '\r\nclass TestRunner\r\n{\r\n  public static void main(String[] args) throws java.lang.Exception\r\n  {\r\n    TestDetail[] test_details = EdTestRunner.executeTests();\r\n    String output = \"<__educative_test_details__>{\\\"test_details\\\": [\";\r\n\r\n    int count = 0;\r\n    for (TestDetail test_detail : test_details) {\r\n      if (count > 0) {\r\n        output += \",\";\r\n      }\r\n      output += \"{\";\r\n      output += \"\\\"input\\\": \\\"\" + test_detail.input + \"\\\",\";\r\n      output += \"\\\"expected_console_regex\\\": \\\"\" + test_detail.expected_console_regex + \"\\\"}\";\r\n      count++;\r\n    }\r\n\r\n\r\n    output += \"]}<\/__educative_test_details__>\";\r\n\r\n    System.out.println(output);\r\n  }\r\n}\r\n',
      version: '1.1'
    }
  },
  javascript: {
    testresults : {
      userCodeStringFormat: 'var edTestMetadata = new function() {\r\n    this.userCode = "{0}";\r\n};',
      authorCode: 'var TestResult = function() {\r\n    this.succeeded = false;\r\n    this.reason = \"\";\r\n    this.input = \"\";\r\n    this.expected_output = \"\";\r\n    this.actual_output = \"\";\r\n}\r\n\r\nvar executeTests = function(){\r\n  var inputs = [0, 1, 2, 5];\r\n  var expected_outputs = [1, 1, 2, 120];\r\n  \r\n  var results = [];\r\n  \r\n  for (var i = 0; i < inputs.length; i++) {\r\n    let result = new TestResult();  \r\n    result.input = \'factorial(\' + inputs[i] + \')\';\r\n    result.expected_output = String(expected_outputs[i]);\r\n    \r\n    \/\/ Call your Challenge function here.\r\n    var actual_output = factorial(inputs[i]);\r\n    result.actual_output = String(actual_output);\r\n    \r\n    if (actual_output === expected_outputs[i]) {\r\n      result.succeeded = true;\r\n      result.reason = \"Succeeded\"\r\n    } else {\r\n      result.succeeded = false;\r\n      result.reason = \"Incorrect Output\"\r\n    }\r\n    \r\n    results.push(result);\r\n  }\r\n  \r\n  return results;\r\n}\r\n',
      edCode: 'var main = function() {\r\n  let results = executeTests();\r\n  let test_results = []\r\n\r\n  for (let result in results) {\r\n    let jres = {}\r\n    jres[\"succeeded\"] = results[result].succeeded\r\n    jres[\"reason\"] = results[result].reason\r\n    jres[\"input\"] = results[result].input\r\n    jres[\"expected_output\"] = results[result].expected_output\r\n    jres[\"actual_output\"] = results[result].actual_output\r\n\r\n    test_results.push(jres)\r\n  }\r\n\r\n  let output = {\"test_results\": test_results};\r\n  let json_output = JSON.stringify(output);\r\n\r\n  console.log(\"<__educative_test_results__>\" + json_output + \"<\/__educative_test_results__>\");\r\n}\r\n\r\nmain();\r\n',
      version: '1.1'
    },
    console : {
      userCodeStringFormat: 'var edTestMetadata = new function() {\r\n    this.userCode = "{0}";\r\n};',
      authorCode: 'var TestDetail = function() {\r\n    this.input = \"\";\r\n    this.expected_console_regex = \"\";\r\n}\r\n\r\nvar executeTests = function(){\r\n  var inputs = [0, 1, 2, 5];\r\n  var expected_outputs = [1, 1, 2, 120];\r\n\r\n  var results = [];\r\n\r\n  for (var i = 0; i < inputs.length; i++) {\r\n    beginTest();\r\n\r\n    let detail = new TestDetail();\r\n    detail.input = \'factorial(\' + inputs[i] + \')\';\r\n    detail.expected_console_regex = String(expected_outputs[i]);\r\n    results.push(detail);\r\n\r\n    \/\/ Call your Challenge function here.\r\n    factorial(inputs[i]);\r\n\r\n    endTest();\r\n  }\r\n\r\n  return results;\r\n}\r\n',
      edCode: 'var __TEST__COUNT = 0;\r\nvar beginTest = function() {\r\n  __TEST__COUNT++;\r\n  console.log(\"<__TEST-OUTPUT-\" + __TEST__COUNT + \"__>\");\r\n}\r\n\r\nvar endTest = function() {\r\n  console.log(\"<\/__TEST-OUTPUT-\" + __TEST__COUNT + \"__>\\\\n\");\r\n}\r\n\r\nvar main = function() {\r\n  var details = executeTests();\r\n  var details_dict = []\r\n\r\n  for (let detail in details) {\r\n    let jres = {};\r\n    jres[\"input\"] = details[detail].input;\r\n    jres[\"expected_console_regex\"] = details[detail].expected_console_regex;\r\n\r\n    details_dict.push(jres);\r\n  }\r\n\r\n  var output = {\"test_details\": details_dict}\r\n  var json_output = JSON.stringify(output)\r\n\r\n  console.log(\"<__educative_test_details__>\" + json_output + \"<\/__educative_test_details__>\");\r\n}\r\n\r\nmain();',
      version: '1.0'
    }
  },
  ruby: {
    testresults : {
      authorCode: 'class TestResult\r\n  attr_accessor :succeeded, :reason, :input, :expected_output, :actual_output\r\n\r\n  def initialize\r\n    @succeeded = false\r\n    @reason = \"\"\r\n    @input = \"\"\r\n    @expected_output = \"\"\r\n    @actual_output = \"\"\r\n  end\r\n\r\n  def to_hash\r\n    {\r\n      \'succeeded\' => @succeeded,\r\n      \'reason\' => @reason,\r\n      \'input\' => @input,\r\n      \'expected_output\' => @expected_output,\r\n      \'actual_output\' => @actual_output,\r\n    }\r\n  end\r\nend\r\n\r\ndef executeTests\r\n  inputs = [0, 1, 2, 5]\r\n  expected_outputs = [1, 1, 2, 120]\r\n\r\n  results = []\r\n\r\n  for i in 0 .. inputs.length-1\r\n    result = TestResult.new\r\n    result.input = \'factorial(\' + inputs[i].to_s + \')\'\r\n    result.expected_output = expected_outputs[i].to_s\r\n\r\n    # Call your challenge function your here.\r\n    actual_output = factorial(inputs[i])\r\n    result.actual_output = actual_output.to_s\r\n\r\n    if (actual_output == expected_outputs[i])\r\n      result.succeeded = true\r\n      result.reason = \"Succeeded\"\r\n    else\r\n      result.succeeded = false\r\n      result.reason = \"Incorrect Output\"\r\n    end\r\n\r\n    results.push(result)\r\n  end\r\n\r\n  return results\r\nend',
      edCode: 'require \'json\'\r\ndef main\r\n  results = executeTests\r\n  output = {\"test_results\" =>  results.map { |e| e.to_hash }}\r\n  puts \"<__educative_test_results__>\" + output.to_json + \"<\/__educative_test_results__>\"\r\nend\r\n\r\nmain\r\n',
      version: '1.0'
    },
    console : {
      authorCode: 'class TestDetail\r\n  attr_accessor :input, :expected_console_regex\r\n\r\n  def initialize\r\n    @input = \"\"\r\n    @expected_console_regex = \"\"\r\n  end\r\n\r\n  def to_hash\r\n    {\r\n      \'input\' => @input,\r\n      \'expected_console_regex\' => @expected_console_regex,\r\n    }\r\n  end\r\nend\r\n\r\ndef executeTests\r\n  inputs = [0, 1, 2, 5]\r\n  expected_outputs = [1, 1, 2, 120]\r\n\r\n  results = []\r\n\r\n\r\n  tester = Tester.new\r\n  for i in 0 .. inputs.length-1\r\n    tester.beginTest\r\n    detail = TestDetail.new\r\n    detail.input = \'factorial(\' + inputs[i].to_s + \')\'\r\n    detail.expected_console_regex = expected_outputs[i].to_s\r\n    results.push(detail)\r\n\r\n    # Call your challenge function your here.\r\n    factorial(inputs[i])\r\n\r\n    tester.endTest\r\n  end\r\n\r\n  return results\r\nend',
      edCode: 'require \'json\'\r\nclass Tester\r\n  def initialize\r\n    @__TEST__COUNT = 0\r\n  end\r\n\r\n  def beginTest\r\n    @__TEST__COUNT+=1\r\n    puts (\"<__TEST-OUTPUT-\" + @__TEST__COUNT.to_s + \"__>\")\r\n  end\r\n  def endTest\r\n    puts (\"<\/__TEST-OUTPUT-\" + @__TEST__COUNT.to_s + \"__>\")\r\n  end\r\nend\r\n\r\ndef main\r\n  results = executeTests\r\n  output = {\"test_details\" =>  results.map { |e| e.to_hash }}\r\n  puts \"<__educative_test_details__>\" + output.to_json + \"<\/__educative_test_details__>\"\r\nend\r\n\r\nmain\r\n',
      version: '1.0'
    }
  },
  python: {
    testresults : {
      userCodeStringFormat: 'class EdTestMetadata:\r\n  def __init__(self):\r\n      self.userCode = \"{0}\"\r\n\r\nedTestMetadata = EdTestMetadata()',
      authorCode: '# Educative\'s Test Runner calls \'executeTests\' that \r\n# should return an array of TestResult (defined below).\r\n# Each TestResult object forms a Row in the output table\r\n\r\n# The following sample is for testing the function \r\n# \'square\' which takes an integer and returns an integer\r\n# e.g.\r\n# def square(n):\r\n#   return n * n\r\n\r\nclass TestResult():\r\n  def __init__(self):\r\n    self.succeeded = False;  # Whether this test succeeded or not\r\n    self.reason = \"\"  # What\'s the reason (specially if failed)\r\n    self.input = \"\"  # What was the input?\r\n    self.expected_output = \"\"  # What was the expected output?\r\n    self.actual_output = \"\"  # What was the output when this test ran\r\n    \r\ndef executeTests():\r\n  inputs = [0, 1, 2, 5]\r\n  expected_outputs = [0, 1, 4, 25]\r\n  results = []\r\n  \r\n  for i in xrange(len(inputs)):\r\n    input = inputs[i]\r\n    expected = expected_outputs[i]\r\n    \r\n    result = TestResult()\r\n    result.input = \'square(\' + str(input) + \')\'\r\n    result.expected_output = str(expected)\r\n    \r\n    actual_output = square(input)\r\n    result.actual_output = str(actual_output)\r\n    if actual_output == expected:\r\n      result.succeeded = True\r\n      result.reason = \"Succeeded\"\r\n    else:\r\n      result.succeeded = False\r\n      result.reason = \"Incorrect Output\"\r\n    \r\n    results.append(result)\r\n  \r\n  return results',
      edCode: '\r\nimport json\r\ndef main():\r\n  results = executeTests()\r\n  test_results = []\r\n\r\n  for result in results:\r\n    jres = {}\r\n    jres[\"succeeded\"] = result.succeeded\r\n    jres[\"reason\"] = result.reason\r\n    jres[\"input\"] = result.input\r\n    jres[\"expected_output\"] = result.expected_output\r\n    jres[\"actual_output\"] = result.actual_output\r\n\r\n    test_results.append(jres)\r\n\r\n  output = {\"test_results\": test_results}\r\n  json_output = json.dumps(output)\r\n\r\n  print \"<__educative_test_results__>\" + json_output + \"<\/__educative_test_results__>\"\r\n\r\n\r\nif __name__ == \"__main__\":\r\n  main()',
      version: '1.1'
    },
    console : {
      userCodeStringFormat: 'class EdTestMetadata:\r\n  def __init__(self):\r\n      self.userCode = \"{0}\"\r\n\r\nedTestMetadata = EdTestMetadata()',
      authorCode: '# Console Tests are needed when learner is \r\n# going to output the result on console.\r\n\r\n# Educative\'s Test Runner calls executeTests that should \r\n# return an array of TestDetail (defined below) objects.\r\n# Each test case should call \'beginTest\' before calling the \r\n# test function and should call \'endTest\' after each test has finished.\r\n\r\n# The following sample is for testing the function \r\n# \'square\' which takes an integer and prints its square\r\n# e.g.\r\n# def square(n):\r\n#   print n * n\r\n\r\nclass TestDetail():\r\n  def __init__(self):\r\n    self.input = \"\"  # input to the function that learner is implementing\r\n    self.expected_console_regex = \"\"  # regex to match console output\r\n    self.expected_output = \"\"  # expected output that\'s shown to the learner\r\n\r\ndef executeTests():\r\n  inputs = [0, 1, 2, 5]\r\n  expected_outputs = [0, 1, 4, 25]\r\n  results = []\r\n  \r\n  for i in xrange(len(inputs)):\r\n    # Required for starting a test case\r\n    beginTest()\r\n\r\n    input = inputs[i]\r\n    expected = expected_outputs[i]\r\n\r\n    detail = TestDetail()\r\n    detail.input = \'square(\' + str(input) + \')\'\r\n    detail.expected_console_regex = str(expected)\r\n    detail.expected_output = str(expected)\r\n    \r\n    results.append(detail)\r\n    \r\n    # Call the actual function\r\n    square(input)\r\n\r\n    # Required for ending a test case\r\n    endTest()\r\n  \r\n  return results',
      edCode: 'class Box():\r\n  pass\r\n\r\n__m = Box()\r\n__m.__TEST__COUNT = 0\r\n\r\ndef beginTest():\r\n  __m.__TEST__COUNT += 1\r\n  print \"<__TEST-OUTPUT-{0}__>\".format(__m.__TEST__COUNT)\r\n\r\ndef endTest():\r\n  print \"<\/__TEST-OUTPUT-{0}__>\\\\n\".format(__m.__TEST__COUNT)\r\n\r\nimport json\r\ndef main():\r\n  details = executeTests()\r\n  details_dict = []\r\n\r\n  for detail in details:\r\n    jres = {}\r\n    jres[\"input\"] = detail.input\r\n    jres[\"expected_console_regex\"] = detail.expected_console_regex\r\n    jres[\"expected_output\"] = detail.expected_output\r\n\r\n    details_dict.append(jres)\r\n\r\n  output = {\"test_details\": details_dict}\r\n  json_output = json.dumps(output)\r\n\r\n  print \"<__educative_test_details__>\" + json_output + \"<\/__educative_test_details__>\"\r\n\r\n\r\nif __name__ == \"__main__\":\r\n  main()\r\n',
      version: '1.1'
    }
  },
  python3: {
    testresults : {
      userCodeStringFormat: 'class EdTestMetadata:\r\n  def __init__(self):\r\n      self.userCode = \"{0}\"\r\n\r\nedTestMetadata = EdTestMetadata()',
      authorCode: '# Educative\'s Test Runner calls \'executeTests\' that \r\n# should return an array of TestResult (defined below).\r\n# Each TestResult object forms a Row in the output table\r\n\r\n# The following sample is for testing the function \r\n# \'square\' which takes an integer and returns an integer\r\n# e.g.\r\n# def square(n):\r\n#   return n * n\r\n\r\nclass TestResult():\r\n  def __init__(self):\r\n    self.succeeded = False;  # Whether this test succeeded or not\r\n    self.reason = \"\"  # What\'s the reason (specially if failed)\r\n    self.input = \"\"  # What was the input?\r\n    self.expected_output = \"\"  # What was the expected output?\r\n    self.actual_output = \"\"  # What was the output when this test ran\r\n    \r\ndef executeTests():\r\n  inputs = [0, 1, 2, 5]\r\n  expected_outputs = [0, 1, 4, 25]\r\n  results = []\r\n  \r\n  for i in range(len(inputs)):\r\n    input = inputs[i]\r\n    expected = expected_outputs[i]\r\n    \r\n    result = TestResult()\r\n    result.input = \'square(\' + str(input) + \')\'\r\n    result.expected_output = str(expected)\r\n    \r\n    actual_output = square(input)\r\n    result.actual_output = str(actual_output)\r\n    if actual_output == expected:\r\n      result.succeeded = True\r\n      result.reason = \"Succeeded\"\r\n    else:\r\n      result.succeeded = False\r\n      result.reason = \"Incorrect Output\"\r\n    \r\n    results.append(result)\r\n  \r\n  return results',
      edCode: '\r\nimport json\r\ndef main():\r\n  results = executeTests()\r\n  test_results = []\r\n\r\n  for result in results:\r\n    jres = {}\r\n    jres[\"succeeded\"] = result.succeeded\r\n    jres[\"reason\"] = result.reason\r\n    jres[\"input\"] = result.input\r\n    jres[\"expected_output\"] = result.expected_output\r\n    jres[\"actual_output\"] = result.actual_output\r\n\r\n    test_results.append(jres)\r\n\r\n  output = {\"test_results\": test_results}\r\n  json_output = json.dumps(output)\r\n\r\n  print(\"<__educative_test_results__>\" + json_output + \"<\/__educative_test_results__>\")\r\n\r\n\r\nif __name__ == \"__main__\":\r\n  main()',
      version: '1.1'
    },
    console : {
      userCodeStringFormat: 'class EdTestMetadata:\r\n  def __init__(self):\r\n      self.userCode = \"{0}\"\r\n\r\nedTestMetadata = EdTestMetadata()',
      authorCode: '# Console Tests are needed when learner is \r\n# going to output the result on console.\r\n\r\n# Educative\'s Test Runner calls executeTests that should \r\n# return an array of TestDetail (defined below) objects.\r\n# Each test case should call \'beginTest\' before calling the \r\n# test function and should call \'endTest\' after each test has finished.\r\n\r\n# The following sample is for testing the function \r\n# \'square\' which takes an integer and prints its square\r\n# e.g.\r\n# def square(n):\r\n#   print(n * n)\r\n\r\nclass TestDetail():\r\n  def __init__(self):\r\n    self.input = \"\"  # input to the function that learner is implementing\r\n    self.expected_console_regex = \"\"  # regex to match console output\r\n    self.expected_output = \"\"  # expected output that\'s shown to the learner\r\n\r\ndef executeTests():\r\n  inputs = [0, 1, 2, 5]\r\n  expected_outputs = [0, 1, 4, 25]\r\n  results = []\r\n  \r\n  for i in range(len(inputs)):\r\n    # Required for starting a test case\r\n    beginTest()\r\n\r\n    input = inputs[i]\r\n    expected = expected_outputs[i]\r\n\r\n    detail = TestDetail()\r\n    detail.input = \'square(\' + str(input) + \')\'\r\n    detail.expected_console_regex = str(expected)\r\n    detail.expected_output = str(expected)\r\n    \r\n    results.append(detail)\r\n    \r\n    # Call the actual function\r\n    square(input)\r\n\r\n    # Required for ending a test case\r\n    endTest()\r\n  \r\n  return results',
      edCode: 'class Box():\r\n  pass\r\n\r\n__m = Box()\r\n__m.__TEST__COUNT = 0\r\n\r\ndef beginTest():\r\n  __m.__TEST__COUNT += 1\r\n  print(\"<__TEST-OUTPUT-{0}__>\".format(__m.__TEST__COUNT))\r\n\r\ndef endTest():\r\n  print(\"<\/__TEST-OUTPUT-{0}__>\\\\n\".format(__m.__TEST__COUNT))\r\n\r\nimport json\r\ndef main():\r\n  details = executeTests()\r\n  details_dict = []\r\n\r\n  for detail in details:\r\n    jres = {}\r\n    jres[\"input\"] = detail.input\r\n    jres[\"expected_console_regex\"] = detail.expected_console_regex\r\n    jres[\"expected_output\"] = detail.expected_output\r\n\r\n    details_dict.append(jres)\r\n\r\n  output = {\"test_details\": details_dict}\r\n  json_output = json.dumps(output)\r\n\r\n  print(\"<__educative_test_details__>\" + json_output + \"<\/__educative_test_details__>\")\r\n\r\n\r\nif __name__ == \"__main__\":\r\n  main()\r\n',
      version: '1.1'
    }
  }
};
