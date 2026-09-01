#Requires -Version 5.1
<#
.SYNOPSIS
    WaveBreaker 수업 준비용 브랜치 헬퍼.

.DESCRIPTION
    주차별(week/NN) · 컨텐츠별(feat/*) · 배포용(snapshot/*) 브랜치를 규칙대로 만들고 머지한다.
    규칙 전문: docs/05_Unity프로젝트/브랜치-전략.md

.EXAMPLE
    .\tools\lesson.ps1 week 7
    .\tools\lesson.ps1 feat player-move
    .\tools\lesson.ps1 done
    .\tools\lesson.ps1 snapshot P8_Final_Single
    .\tools\lesson.ps1 status
    .\tools\lesson.ps1 list
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [ValidateSet('week', 'feat', 'snapshot', 'done', 'status', 'list')]
    [string]$Command,

    [Parameter(Position = 1)]
    [string]$Name,

    [switch]$Force
)

$ErrorActionPreference = 'Stop'

# ---------------------------------------------------------------- helpers

function Invoke-Git {
    param([string[]]$GitArgs)
    $out = & git @GitArgs
    if ($LASTEXITCODE -ne 0) {
        throw ("git " + ($GitArgs -join ' ') + " 실패 (exit $LASTEXITCODE)")
    }
    return $out
}

function Get-CurrentBranch {
    return (& git rev-parse --abbrev-ref HEAD).Trim()
}

function Test-Branch {
    param([string]$Branch)
    & git show-ref --verify --quiet "refs/heads/$Branch"
    return ($LASTEXITCODE -eq 0)
}

function Assert-CleanTree {
    $dirty = & git status --porcelain
    if ($dirty) {
        Write-Host ""
        Write-Host "커밋되지 않은 변경:" -ForegroundColor Yellow
        $dirty | ForEach-Object { Write-Host "  $_" }
        Write-Host ""
        throw "작업 트리가 깨끗하지 않습니다. 커밋하거나 'git stash' 후 다시 실행하세요."
    }
}

function Get-PhaseForSession {
    param([int]$Session)
    if ($Session -le 20)  { return '0  (C# 기초 · 콘솔)' }
    if ($Session -le 30)  { return '1  (C# 객체지향 · 콘솔)' }
    if ($Session -le 40)  { return '2  (유니티 입문)' }
    if ($Session -le 55)  { return '3  (유니티 2D 핵심)' }
    if ($Session -le 65)  { return '4  (미니게임 완주)' }
    if ($Session -le 80)  { return '5  (본 프로젝트 코어)' }
    if ($Session -le 90)  { return '6  (콘텐츠 · 데이터)' }
    if ($Session -le 100) { return '7  (UI · 연출)' }
    if ($Session -le 105) { return '8  (싱글 완성 & 빌드) *' }
    if ($Session -le 125) { return '9  (네트워크 협동)' }
    if ($Session -le 130) { return '10 (배포 · 발표)' }
    return '-  (버퍼)'
}

function Get-WeekInfo {
    param([int]$Week)
    if ($Week -lt 1 -or $Week -gt 28) {
        throw "주차는 1~28 사이여야 합니다. 입력값: $Week"
    }
    $first = 5 * $Week - 4
    $last = 5 * $Week
    return [pscustomobject]@{
        Week   = $Week
        First  = $first
        Last   = $last
        Phase  = (Get-PhaseForSession $first)
        Branch = ('week/{0:d2}' -f $Week)
    }
}

function Set-Parent {
    param([string]$Branch, [string]$Parent)
    & git config "branch.$Branch.lessonParent" $Parent | Out-Null
}

function Get-Parent {
    param([string]$Branch)
    $p = & git config --get "branch.$Branch.lessonParent"
    if ($LASTEXITCODE -ne 0) { return $null }
    if (-not $p) { return $null }
    return $p.Trim()
}

function Show-Status {
    $cur = Get-CurrentBranch
    Write-Host ""
    Write-Host "  현재 브랜치 : $cur" -ForegroundColor Cyan
    if ($cur -match '^week/(\d{2})$') {
        $w = Get-WeekInfo ([int]$Matches[1])
        Write-Host ("  주차        : {0}주차  (회차 {1:d3}-{2:d3})" -f $w.Week, $w.First, $w.Last)
        Write-Host ("  Phase       : {0}" -f $w.Phase)
    }
    $parent = Get-Parent $cur
    if ($parent) {
        Write-Host "  머지 대상   : $parent   ('lesson.ps1 done' 실행 시)"
    }
    Write-Host ""
}

# ---------------------------------------------------------------- commands

switch ($Command) {

    'week' {
        if (-not $Name) { throw "주차 번호가 필요합니다.  예:  .\tools\lesson.ps1 week 7" }
        $n = 0
        if (-not [int]::TryParse($Name, [ref]$n)) { throw "주차는 숫자여야 합니다. 입력값: $Name" }
        $w = Get-WeekInfo $n
        Assert-CleanTree

        if (Test-Branch $w.Branch) {
            Invoke-Git @('switch', $w.Branch) | Out-Null
            Write-Host "기존 브랜치로 이동: $($w.Branch)" -ForegroundColor Green
        }
        else {
            Invoke-Git @('switch', 'main') | Out-Null
            Invoke-Git @('switch', '-c', $w.Branch) | Out-Null
            Set-Parent $w.Branch 'main'
            Write-Host "생성: $($w.Branch)   (main 에서 분기)" -ForegroundColor Green
        }
        if ($w.First -le 30) {
            Write-Host "  ! $($w.Week)주차는 C# 콘솔 구간입니다. Unity 저장소에서 다룰 내용이 아닐 수 있습니다." -ForegroundColor Yellow
        }
        Show-Status
    }

    'feat' {
        if (-not $Name) { throw "기능 이름이 필요합니다.  예:  .\tools\lesson.ps1 feat player-move" }
        $cur = Get-CurrentBranch
        if (($cur -notmatch '^week/\d{2}$') -and (-not $Force)) {
            throw "feat 브랜치는 week/NN 위에서 만듭니다. 현재: $cur. 먼저 'lesson.ps1 week <주차>' 를 실행하거나, 그대로 진행하려면 -Force 를 붙이세요."
        }
        $slug = ($Name -replace '[^a-zA-Z0-9\-_]', '-').Trim('-').ToLower()
        if (-not $slug) { throw "사용할 수 있는 문자가 없습니다: $Name" }
        $branch = "feat/$slug"
        Assert-CleanTree

        if (Test-Branch $branch) {
            Invoke-Git @('switch', $branch) | Out-Null
            Write-Host "기존 브랜치로 이동: $branch" -ForegroundColor Green
        }
        else {
            Invoke-Git @('switch', '-c', $branch) | Out-Null
            Set-Parent $branch $cur
            Write-Host "생성: $branch   ($cur 에서 분기)" -ForegroundColor Green
        }
        Show-Status
    }

    'snapshot' {
        if (-not $Name) { throw "스냅샷 이름이 필요합니다.  예:  .\tools\lesson.ps1 snapshot P8_Final_Single" }
        $branch = "snapshot/$Name"
        if (Test-Branch $branch) { throw "이미 있습니다: $branch  (스냅샷은 덮어쓰지 않습니다)" }
        Assert-CleanTree

        $back = Get-CurrentBranch
        Invoke-Git @('switch', 'main') | Out-Null
        Invoke-Git @('branch', $branch) | Out-Null
        if ($back -ne 'main' -and (Test-Branch $back)) { Invoke-Git @('switch', $back) | Out-Null }

        Write-Host "고정: $branch   (main 시점)" -ForegroundColor Green
        Write-Host "  스냅샷 브랜치에는 커밋하지 않습니다. 배포 압축본은 아래 명령으로 뽑습니다:" -ForegroundColor DarkGray
        Write-Host "  git archive --format=zip -o $Name.zip $branch" -ForegroundColor DarkGray
        Show-Status
    }

    'done' {
        Assert-CleanTree
        $cur = Get-CurrentBranch
        if ($cur -eq 'main') { throw "main 에서는 실행할 수 없습니다." }
        if ($cur -like 'snapshot/*') { throw "스냅샷 브랜치는 머지 대상이 아닙니다: $cur" }

        $parent = Get-Parent $cur
        if (-not $parent) {
            throw "$cur 의 머지 대상이 기록돼 있지 않습니다. 수동 지정: git config branch.$cur.lessonParent <부모브랜치>"
        }
        if (-not (Test-Branch $parent)) { throw "부모 브랜치가 없습니다: $parent" }

        if ($parent -eq 'main') {
            Write-Host ""
            Write-Host "  main 으로 머지합니다. Unity 에서 컴파일 · 플레이가 되는지 확인했습니까?" -ForegroundColor Yellow
            if (-not $Force) {
                $ans = Read-Host "  계속하려면 y 를 입력하세요"
                if ($ans -ne 'y') { Write-Host "취소했습니다."; return }
            }
        }

        Invoke-Git @('switch', $parent) | Out-Null
        Invoke-Git @('merge', '--no-ff', '-m', "merge $cur -> $parent", $cur) | Out-Null
        Write-Host "머지 완료: $cur -> $parent" -ForegroundColor Green
        Write-Host "  브랜치는 남겨 둡니다. 지우려면:  git branch -d $cur" -ForegroundColor DarkGray
        Show-Status
    }

    'status' {
        Show-Status
    }

    'list' {
        $all = @(& git for-each-ref --format='%(refname:short)' refs/heads)
        $cur = Get-CurrentBranch

        $groups = [ordered]@{
            'main'      = @($all | Where-Object { $_ -eq 'main' })
            'week/'     = @($all | Where-Object { $_ -like 'week/*' } | Sort-Object)
            'feat/'     = @($all | Where-Object { $_ -like 'feat/*' } | Sort-Object)
            'snapshot/' = @($all | Where-Object { $_ -like 'snapshot/*' } | Sort-Object)
        }
        $known = @()
        foreach ($key in $groups.Keys) { $known += $groups[$key] }
        $other = @($all | Where-Object { $known -notcontains $_ } | Sort-Object)

        Write-Host ""
        foreach ($key in $groups.Keys) {
            if (-not $groups[$key]) { continue }
            Write-Host "  [$key]" -ForegroundColor Cyan
            foreach ($b in $groups[$key]) {
                $mark = '   '
                if ($b -eq $cur) { $mark = ' * ' }
                $note = ''
                if ($b -match '^week/(\d{2})$') {
                    $w = Get-WeekInfo ([int]$Matches[1])
                    $note = ('  -  {0}주차 / 회차 {1:d3}-{2:d3} / Phase {3}' -f $w.Week, $w.First, $w.Last, $w.Phase)
                }
                Write-Host "$mark$b$note"
            }
        }
        if ($other) {
            Write-Host "  [기타]" -ForegroundColor Cyan
            foreach ($b in $other) {
                $mark = '   '
                if ($b -eq $cur) { $mark = ' * ' }
                Write-Host "$mark$b"
            }
        }
        Write-Host ""
    }
}
