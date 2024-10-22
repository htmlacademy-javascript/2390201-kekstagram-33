// Домашнее задание к разделу 2
//2.1 Функция для проверки длины строки. Она принимает строку, которую нужно проверить, и максимальную длину и возвращает true, если строка меньше или равна указанной длине, и false, если строка длиннее.
const stringNotLongerThanLength = (string, length) => string.length <= length;

// // Тесты функции stringNotLongerLength
// // Строка короче 20 символов
// console.log(stringNotLongerThanLength('проверяемая строка',20)); // true
// // Длина строки ровно 18 символов
// console.log(stringNotLongerThanLength('проверяемая строка', 18)); // true
// // Строка длиннее 10 символов
// console.log(stringNotLongerThanLength('проверяемая строка', 10)); // false


// 2.2 Функция для проверки, является ли строка палиндромом. Палиндром — это слово или фраза, которые одинаково читаются и слева направо и справа налево.

let stringIsPalindrome = function (string) {
  let modifiedString = string.replaceAll(' ','').toUpperCase();
  let reversedString = '';

  for (let i = (modifiedString.length-1); i >= 0 ; i -= 1) {
    reversedString += modifiedString[i];
  }
  return reversedString === modifiedString;
}

// // Тесты функции stringIsPalindrome
// console.log(stringIsPalindrome('А роза упала на лапу Азора'));//true
// console.log(stringIsPalindrome('не палиндром'));//false
// // Строка является палиндромом
// console.log(stringIsPalindrome('топот')); // true
// // Несмотря на разный регистр, тоже палиндром
// console.log(stringIsPalindrome('ДовОд')); // true
// // Это не палиндром
// console.log(stringIsPalindrome('Кекс'));  // false
// // Это палиндром
// console.log(stringIsPalindrome('Лёша на полке клопа нашёл ')); // true


// 2.3 Функция принимает строку, извлекает содержащиеся в ней цифры от 0 до 9 и возвращает их в виде целого положительного числа. Если в строке нет ни одной цифры, функция должна вернуть NaN:

let takeNumeralsFromString = function (string) {
  string = '' + string;
  let numeralsInString = '';

  for (let i = 0; i < string.length; i += 1 ) {
    switch (string[i]) {
      case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
        numeralsInString += string[i];
    }
  }
  return parseInt (numeralsInString, 10);
}

// Тесты функции takeNumeralsFromString
console.log(takeNumeralsFromString('2023 год'));            // 2023
console.log(takeNumeralsFromString('ECMAScript 2022'));     // 2022
console.log(takeNumeralsFromString('1 кефир, 0.5 батона')); // 105
console.log(takeNumeralsFromString('агент 007'));           // 7
console.log(takeNumeralsFromString('а я томат'));           // NaN
console.log(takeNumeralsFromString(2023));                  // 2023
console.log(takeNumeralsFromString(-1));                    // 1
console.log(takeNumeralsFromString(1.5));                   // 15
