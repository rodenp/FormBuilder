# Development Workflow Guidelines

## Critical Rules for Claude Code Assistant

### Git Workflow - MANDATORY
1. **ALWAYS ASK BEFORE COMMITTING**: Never commit without user approval
2. **Test and verify changes work**: User must confirm functionality before any commit
3. **Commit frequently**: After every meaningful change that's confirmed working
4. **Stash before big changes**: Use `git stash save "Description of current state"` before major modifications
5. **Descriptive commit messages**: Use clear messages like:
   - "Menu cells working - individual clicks enabled"
   - "Button styling fixed for menu items"
   - "Column cells functionality restored"
6. **Create feature branches**: For experimental changes, use feature branches to preserve main
7. **Never commit broken code**: Only commit when user confirms it's working

### Before Making Changes
1. **Understand the codebase structure**: Check if there are multiple versions (/src vs /lib)
2. **Identify which version is running**: Check file paths in browser dev tools
3. **Read this file after every context refresh**
4. **Test current functionality** before making changes

### When Debugging
1. **Use git history**: `git log --oneline` to see recent changes
2. **Check file modification times**: `ls -la` to see what was recently changed
3. **Use git diff**: Compare current state with last known working commit
4. **Never guess**: If unsure about working state, ask the user or check git history

### Communication Rules
1. **Be honest about limitations**: Don't claim to have access to things you don't
2. **Ask before major architectural changes**
3. **Explain which files you're modifying and why**
4. **Notify user about multiple codebases or versions found**

### File Organization
1. **Only work on the correct codebase**: Confirm with user which version is running
2. **Avoid creating duplicate implementations**
3. **Check imports and dependencies** before making changes

### Testing & Verification
1. **Test after each change**: Don't make multiple changes without testing
2. **Commit working states immediately**
3. **Document what's working and what's broken** in commit messages
4. **Never leave code in a broken state** without committing the last working version

## Current Project Notes
- Project has two codebases: main `/src` and library `/lib`
- User sees file paths with `/lib/src/components/` in browser dev tools
- Menu component needs individual clickable cells like column cells
- Always check which version is actually running before making changes

## Recovery Process When Things Break
1. Check git log for last working commit
2. Use git diff to see what changed
3. If no git history available, ask user when it was last working
4. Create feature branch for fixes
5. Commit every small working improvement

---
**READ THIS FILE AFTER EVERY CONTEXT REFRESH**