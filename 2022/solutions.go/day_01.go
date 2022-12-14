package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"regexp"
	"sort"
	"strconv"
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
	emptyLine := regexp.MustCompile("\r?\n\r?\n")

	elfTotals := []int{}

	for _, elfItems := range emptyLine.Split(data, -1) {
		total := 0
		for _, itemStr := range endLine.Split(elfItems, -1) {
			item, err := strconv.Atoi(itemStr)
			checkError(err)
			total += item
		}
		elfTotals = append(elfTotals, total)
	}

	sort.Ints(elfTotals)

	count := len(elfTotals)

	fmt.Println(elfTotals[count-1])

	sum := 0

	for _, elf := range elfTotals[count-3:] {
		sum += elf
	}

	fmt.Println(sum)

}
