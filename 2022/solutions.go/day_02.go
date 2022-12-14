package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"regexp"
)

func checkError(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func main() {

	inputFile := os.Args[1]

	dataBytes, err := ioutil.ReadFile(inputFile)
	checkError(err)
	data := string(dataBytes)

	endLine := regexp.MustCompile("\r?\n")
	whitespace := regexp.MustCompile("\\s")

	translations := map[string]int{"A": 0, "B": 1, "C": 2, "X": 0, "Y": 1, "Z": 2}

	p1score := 0
	p2score := 0

	for _, rule := range endLine.Split(data, -1) {
		chars := whitespace.Split(rule, -1)
		them := translations[chars[0]]
		us := translations[chars[1]]
		p1score += 1 + us + (us-them+4)%3*3
		p2score += 1 + us*3 + (them+us+5)%3
	}

	fmt.Println(p1score)
	fmt.Println(p2score)

}
