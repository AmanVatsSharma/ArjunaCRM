# CI/CD Pipelines Review & Issues Found

## 🔍 Review Summary

After reviewing all CI/CD workflows and documentation, the following issues were identified:

## ❌ Critical Issues

### 1. **arjuna-docs Build Path Incorrect**
**File**: `.github/workflows/deploy-docs.yml`
**Issue**: Docs uses Mintlify, not Next.js. Build output is `.mintlify`, not `.next/out/`
**Current**: `packages/arjuna-docs/.next/out/`
**Should be**: `packages/arjuna-docs/.mintlify/`

### 2. **Deprecated GitHub Release Action**
**File**: `.github/workflows/release.yml`
**Issue**: Uses deprecated `actions/create-release@v1` which is archived
**Current**: `uses: actions/create-release@v1`
**Should use**: `softprops/action-gh-release@v1` or GitHub CLI

### 3. **Backend Deployment - Hardcoded Placeholders**
**File**: `.github/workflows/deploy-backend.yml`
**Issue**: Database migration step has hardcoded subnet and security group placeholders
**Line 85**: `--network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"`
**Fix**: Should use environment variables or secrets

### 4. **arjuna-docs Package Still References Yarn**
**File**: `packages/arjuna-docs/package.json`
**Issue**: Still has yarn in engines and references yarn commands
**Lines 18-19**: `"npm": "please-use-yarn"`, `"yarn": "^4.0.2"`

### 5. **Existing CI Workflows Still Reference Yarn**
**Files**: Multiple existing CI workflows still check for `yarn.lock`
- `.github/workflows/ci-front.yaml` (line 27)
- `.github/workflows/ci-server.yaml` (line 26)
- And others...

### 6. **Yarn Install Action Still Exists**
**File**: `.github/workflows/actions/yarn-install/action.yaml`
**Issue**: Custom action still uses yarn and references `yarn.lock`
**Needs**: Update to npm or create new npm-install action

## ⚠️ Medium Priority Issues

### 7. **CI Workflow Conflicts**
**Issue**: New simplified `ci.yml` may conflict with existing granular CI workflows
**Existing workflows**:
- `ci-front.yaml`
- `ci-server.yaml`
- `ci-docs.yaml`
- `ci-website.yaml`
- `ci-shared.yaml`
- `ci-sdk.yaml`
- `ci-emails.yaml`
- `ci-utils.yaml`
- `ci-e2e.yaml`

**Recommendation**: Either:
- Update all existing workflows to use npm, OR
- Remove the new simplified `ci.yml` and keep granular workflows

### 8. **Missing Environment Variables in Workflows**
**Issue**: Some workflows don't document all required environment variables
**Fix**: Add comprehensive env var documentation

### 9. **No Error Handling for AWS Commands**
**Issue**: AWS CLI commands don't have proper error handling
**Fix**: Add `set -e` and error checks

### 10. **Release Workflow Changelog Generation**
**Issue**: Simple git log may not produce good changelogs
**Fix**: Consider using conventional-changelog or similar tool

## 📝 Documentation Issues

### 11. **Docs Build Output Documentation**
**File**: `docs/deployment/ci-cd-guide.md`
**Issue**: Doesn't mention Mintlify build output path
**Fix**: Update to reflect correct build output

### 12. **Missing Workflow Dependencies**
**Issue**: Documentation doesn't explain workflow dependencies
**Fix**: Add section on workflow execution order

## ✅ What's Working Well

1. ✅ All new workflows use npm correctly
2. ✅ AWS deployment structure is sound
3. ✅ Environment variables are well documented
4. ✅ Deployment workflows are properly structured
5. ✅ CloudFront cache invalidation is correct
6. ✅ S3 deployment strategy is appropriate

## 🔧 Recommended Fixes

### Priority 1 (Critical - Must Fix)

1. Fix docs deployment build path
2. Update release workflow to use non-deprecated action
3. Fix backend deployment network configuration
4. Update arjuna-docs package.json
5. Update or remove yarn-install action

### Priority 2 (Important - Should Fix)

6. Update all existing CI workflows to use npm
7. Add error handling to AWS commands
8. Update documentation with correct paths

### Priority 3 (Nice to Have)

9. Improve changelog generation
10. Add workflow dependency documentation
11. Add retry logic for AWS operations

## 📋 Action Items

- [ ] Fix `deploy-docs.yml` build path
- [ ] Update `release.yml` to use modern GitHub release action
- [ ] Fix `deploy-backend.yml` network configuration
- [ ] Update `packages/arjuna-docs/package.json`
- [ ] Update or remove `yarn-install` action
- [ ] Update all existing CI workflows to use npm
- [ ] Add error handling to all workflows
- [ ] Update documentation with correct information

