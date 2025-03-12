-- CreateIndex
CREATE INDEX "District_regencyId_idx" ON "District"("regencyId");

-- CreateIndex
CREATE INDEX "Regency_provinceId_idx" ON "Regency"("provinceId");

-- CreateIndex
CREATE INDEX "RolePermission_roleId_idx" ON "RolePermission"("roleId");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE INDEX "UserRegion_userId_idx" ON "UserRegion"("userId");

-- CreateIndex
CREATE INDEX "UserRegion_regionId_idx" ON "UserRegion"("regionId");

-- CreateIndex
CREATE INDEX "UserRole_userId_idx" ON "UserRole"("userId");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");

-- CreateIndex
CREATE INDEX "Village_districtId_idx" ON "Village"("districtId");
