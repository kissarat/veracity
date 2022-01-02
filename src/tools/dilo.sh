#!/usr/bin/env bash

export DILO_VERSION=1
export DILO_NAME=ysyncx
RED='\033[0;31m'
GREED='\033[0;32m'
YELLOW='\033[1;33m'
ORANGE='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

function fatal() {
    >&2 printf "${PURPLE}$@${NC}\n"
    exit 1
}

function fail() {
    >&2 printf "${RED}$@${NC}\n"
}

function warn() {
    >&2 printf "${YELLOW}$@${NC}\n"
}

function info() {
    echo $@
}

function debug() {
    printf "${BLUE}$@${NC}\n"
}

function trace() {
    printf "${BLUE}$@${NC}\n"
}

function getenv() {
    local name=$1
    echo "${!name}"
}

function required() {
    local name="$1"
    [ -z $(getenv $name) ] \
        && error "Environment variable $name is required" \
        && return 1
    
}

function define() {
    local name=$1
    [ -z $name ] && fail "Environment variable name is required"
    local value=$(getenv $name)
    if [ -z "$value" ]; then
        local default_value=$2
        [ -z "$default_value" ] && fail "Default value for environment variable $name is required"
        export "$name=$default_value"
        return 0
    fi
    return 1
}

function assigment() {
    local prefix=$1
    echo "^$prefix *[^=#]+="
}

function declaration() {
    local prefix=$1
    egrep "$(assigment $prefix)" | sed "s/^$prefix *//g"
}

function map() {
    while read line; do
        $@ ${line}
    done
}

function apply() {
    while read line; do
        ${line} $@
    done
}

function normalize() {
    local p=$1
    dir=$(pwd)
    if [[ ! -z "$p" ]]; then
        current=$dir
        cd "$p" || return 1
        dir=$(pwd)
        cd "$current"
    fi
    echo $dir
}

function walk() {
    local type=$1
    [ -z $type ] && type=-f
    local dir=$2
    [ -z "$dir" ] && dir=.
    # dir=$(normalize $dir)
    for entry in `ls $dir`; do
        entrypath="$dir/$entry"
        [ $type "$entrypath" ] && echo $entrypath
        [ -d "$entrypath" ] && walk $type "$entrypath"
    done
}

function filter() {
    while read line; do
        eval "[[ $@ \"${line}\" ]]" && echo "${line}";
    done
}

function create-tool() {
    local name=$1
    [ -z $name ] && fail 'Name is required' && return 1
    local filename=$DILO_PATH/$name.sh
    [ -f $filename ] && fail "Toolbox '${name}' already exists" && return 1
    sed "s/name/${name}/g" >$filename <<TEMPLATE
#!/usr/bin/env bash



# name definition
# define ENV development
# end definition
TEMPLATE
}

define MACHINE_ARCH amd64
define ENV development
define TMPDIR /tmp
# define DILO_CNAME ysinkx.com
# define DILO_TARGET admin@inner.ysinkx.com
define ENV development
define TIMESTAMP_FORMAT %y%m%d_%H%M%S
define DATE_FORMAT '%y.%m.%d'
define TIME_FORMAT '%H:%M:%S'
define DATETIME_FORMAT "${DATE_FORMAT?}-${TIME_FORMAT?}"
define DILO_DUMP_DIR ${TMPDIR?}/dump-${TIME_FORMAT?}
define DILO_PATH $(normalize $(dirname $BASH_SOURCE[0]))
define DILO_ROOT $(normalize "$DILO_PATH/../..")
# define TOOLSET 'git,virtualization,gitlab'
define LANG "en_US.UTF-8"
define LC_ALL "en_US.UTF-8"
define LC_CTYPE "en_US.UTF-8"
