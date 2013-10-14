PUBLIC_DIR = public
PUBLIC_CSS_DIR = $(PUBLIC_DIR)/css
PUBLIC_JS_DIR = $(PUBLIC_DIR)/js
PUBLIC_IMAGE_DIR = $(PUBLIC_DIR)/image
PUBLIC_IMAGE_GEN_DIR = $(IMAGE_DIR)/generated
PUBLIC_FONT_DIR = $(PUBLIC_DIR)/font

COMPASS_BIN = compass
COMPASS_DIR = compass
COMPASS_CACHE_DIR = .sass-cache
COMPASS_ENV = development # development | production
COMPASS_OPTS = --load-all $(COMPASS_DIR)/frameworks --environment $(COMPASS_ENV) --trace

DELETE = rm -f
DELETEDIR = $(DELETE) -r

all: build-css build-js
	ls -lsa

clean-css-cache:
	$(DELETEDIR) $(COMPASS_CACHE_DIR)

clean-css: clean-css-cache
	$(DELETE) $(PUBLIC_CSS_DIR)/*.css

build-css:
	$(COMPASS_BIN) compile $(COMPASS_OPTS) $(COMPASS_DIR)

watch-css:
	$(COMPASS_BIN) watch $(COMPASS_OPTS) $(COMPASS_DIR)

build-js: javascript-minify

javascript-minify:

# node shortcuts

node-run:
	node run.js

# git shortcuts

git-pending-commits:
	git log origin/develop..HEAD

git-pending-merges:
	git log origin/master..origin/develop

git-unstaged:
	git status

git-staged:
	git status --cached

help: ; # Current variables and targets.
	make -pn | sed -rn '/^[^# \t\.%].*:/p'