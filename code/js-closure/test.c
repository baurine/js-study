#include <stdio.h>
#include <string.h>

char* get_str() {
  char s[5] = "test";
  return s;
}

int main() {
  char* s1 = get_str();
  printf("%s", s1);
  printf("%d", strlen(s1));

  char s2[5] = "test";
  printf("%s", s2);
  printf("%d", strlen(s2));
}
