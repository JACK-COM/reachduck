.PHONY: clear-screen compress

BUILD_DIR := lib
NETWK_DIR := lib/networks
UTILS_DIR := lib/utils
TOP_LEVEL := $(shell find $(BUILD_DIR) -name '*.js')
MIN := uglifyjs -m -c -o

clear-screen:
	@clear

compress: $(TOP_LEVEL)
	@echo "Compressing all JS files $(BUILD_DIR) ...\n\n"
	@$(foreach file, $(wildcard $(BUILD_DIR)/*.js), echo "\n + Compressing $(file)"; $(MIN) $(file) -- $(file);)
	@$(foreach file, $(wildcard $(NETWK_DIR)/*.js), echo "\n + Compressing $(file)"; $(MIN) $(file) -- $(file);)
	@$(foreach file, $(wildcard $(UTILS_DIR)/*.js), echo "\n + Compressing $(file)"; $(MIN) $(file) -- $(file);)
	@echo 
	@echo "All files compressed!"
	@exit 0
